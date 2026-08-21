import React, { useState } from "react";
import { File } from "expo-file-system";
import { fetch } from "expo/fetch";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {SelectedVideo, VideoAnalysis} from "@/lib/types";
import * as ImagePicker from "expo-image-picker";
import VideoPreview from "@/components/VideoPreview";
import {router} from "expo-router";
import {apiURL} from "@/lib/constants";
import supabase from "@/lib/subabaseClient";
import {useAuthSession} from "@/providers/AuthProvider";
import DumbbellSpinner from "@/components/dumbbellSpinner";

type Exercise = "Bicep Curl" | "Bench Press" | "Squat";
type APIExercise = "BICEP CURL" | "BENCH PRESS" | "SQUAT";

const exerciseOptions: Exercise[] = [
    "Bicep Curl",
    "Bench Press",
    "Squat",
];

const exerciseAPIMap: Record<Exercise, APIExercise> = {
    "Bicep Curl": "BICEP CURL",
    "Bench Press": "BENCH PRESS",
    "Squat": "SQUAT",
}

function requireHeader(response: Response, name: string): string {
    const value = response.headers.get(name);

    if (value === null) {
        throw new Error(`Response is missing header "${name}"`);
    }

    return value;
}


export default function NewScreen() {
    const [selectedExercise, setSelectedExercise] =
        useState<Exercise>("Squat");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const hasSelectedVideo = selectedVideo !== null;
    const { session } = useAuthSession();

    async function onSelectVideo() {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                "Permission required",
                "Please allow access to your videos."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["videos"],
            allowsEditing: false,
            quality: 1,
            selectionLimit: 1,
            shouldDownloadFromNetwork: true,
        });

        if (result.canceled) return;

        const asset = result.assets[0];

        const fileSize = asset.fileSize ?? 0;
        const maxSize = 100 * 1024 * 1024;

        if (fileSize > maxSize) {
            Alert.alert(
                "Video is too large",
                "Please select a video smaller than 100MB."
            );
            return;
        }

        setSelectedVideo({
            uri: asset.uri,
            fileName: asset.fileName ?? `workout-${Date.now()}.mp4`,
            mimeType: asset.mimeType ?? "video/mp4",
            fileSize,
            duration: asset.duration ?? 0,
        });
    }

    async function getAnalysis(exercise: APIExercise): Promise<{ videoAnalysis: VideoAnalysis; processedVideoBytes: Uint8Array; }> {
        if (!selectedVideo) {
            throw new Error("No video selected");
        }

        const videoFile = new File(selectedVideo.uri);
        const formData = new FormData();
        formData.append("file", videoFile, selectedVideo.fileName);
        formData.append("exercise", exercise);

        const response = await fetch(apiURL, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(
                `Analysis failed (${response.status}): ${message}`
            );
        }

        const videoAnalysis: VideoAnalysis =  {
            totalScore: Number(
                requireHeader(response, "total_score")
            ),
            repCount: Number(
                requireHeader(response, "rep_count")
            ),
            completeRomRepCount: Number(
                requireHeader(response, "complete_rom_rep_count")
            ),
            partialRomRepCount: Number(
                requireHeader(response, "partial_rom_rep_count")
            ),
            cheatRepCount: Number(
                requireHeader(response, "cheat_rep_count")
            ),
            eccentricDurations: JSON.parse(
                requireHeader(response, "eccentric_durations")
            ),
            minAndMaxRepAngles: JSON.parse(
                requireHeader(response, "min_and_max_rep_angles")
            ),
            footCheatReps: Number(
                requireHeader(response, "foot_cheat_reps")
            ),
            toeKneeAlignedReps: Number(
                requireHeader(response, "toe_knee_aligned_reps")
            ),
            horizontalThighReps: Number(
                    requireHeader(response, "horizontal_thigh_reps")
            )
        };

        const processedVideoBytes = await response.bytes();

        return {
            videoAnalysis,
            processedVideoBytes,
        }
    }

    async function storeVideoInBucket(storagePath: string, arrayBuffer: ArrayBuffer) {
        const { data, error } = await supabase.storage.from('videos').upload(storagePath, arrayBuffer, {
            contentType: "video/mp4",
            upsert: false,
        });

        if (error) {
            throw error;
        }

        return data;
    }

    async function storeAnalysis(storagePath: string, userId: string, exercise: APIExercise, score: number) {
        const { data, error } = await supabase.from('videos').insert({ file_url: storagePath, user_id: userId, exercise_type: exercise, score: score, analysis: 'sample gpt analysis' }).select("id").single();

        if (error) {
            throw error;
        }

        return data?.id;
    }

    async function onSubmit(exercise: Exercise) {
        console.log("SUBMITTED");
        console.log(exercise);
        console.log(selectedVideo?.fileName);

        const apiExercise = exerciseAPIMap[exercise];

        if (!hasSelectedVideo) {
            return;
        }

        setIsUploading(true);

        console.log('Fetching Analysis...')
        const { videoAnalysis, processedVideoBytes } = await getAnalysis(apiExercise);
        console.log("Analysis obtained");

        if (!processedVideoBytes || !videoAnalysis) {
            return;
        }

        const arrayBuffer = new Uint8Array(processedVideoBytes).buffer;

        // Get the current user from the session if it exists
        if (!session || !session.user) {
            console.error('User not authenticated');
            // Handle not authenticated case
            return;
        }

        const userId = session.user.id;

        const storagePath = `${userId}/${Date.now()}-processed.mp4`;
        // Store the video file in supabase storage bucket
        console.log('Uploading video to storage bucket');
        await storeVideoInBucket(storagePath, arrayBuffer);

        console.log('Successfully uploaded video file to storage bucket');

        // save analysis in supabase database
        // TODO: FETCH TEXT ANALYSIS FROM GPT MODEL AND INCLUDE IN REQUEST
        const videoId = await storeAnalysis(storagePath, userId, apiExercise, videoAnalysis.totalScore);
        console.log("Stored the analysis data in db");

        console.log('Video Id:', videoId);

        setIsUploading(false);

        router.push({
            pathname: "/analysis/[videoId]",
            params: {
                videoId: videoId,
            },
        });
    }

    function selectExercise(exercise: Exercise) {
        setSelectedExercise(exercise);
        setDropdownOpen(false);
    }

    if (isUploading) {
        return (
            <DumbbellSpinner />
        );
    }

    return (
        <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.screen}>
                <Text style={styles.title}>New Assessment</Text>

                <Text style={styles.fieldLabel}>EXERCISE TYPE</Text>

                <View style={styles.dropdownWrapper}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Choose exercise type"
                        accessibilityState={{ expanded: dropdownOpen }}
                        style={({ pressed }) => [
                            styles.dropdownButton,
                            pressed && styles.pressed,
                            dropdownOpen && styles.dropdownButtonOpen,
                        ]}
                        onPress={() => setDropdownOpen((current) => !current)}
                    >
                        <View style={styles.dropdownSelection}>
                            <Ionicons
                                name="barbell-outline"
                                size={23}
                                color="black"
                            />

                            <Text style={styles.dropdownText}>
                                {selectedExercise}
                            </Text>
                        </View>

                        <Feather
                            name={dropdownOpen ? "chevron-up" : "chevron-down"}
                            size={22}
                            color="#565B66"
                        />
                    </Pressable>

                    {dropdownOpen && (
                        <View style={styles.dropdownMenu}>
                            {exerciseOptions.map((exercise, index) => {
                                const selected = exercise === selectedExercise;

                                return (
                                    <Pressable
                                        key={exercise}
                                        accessibilityRole="button"
                                        style={({ pressed }) => [
                                            styles.dropdownOption,
                                            index !== exerciseOptions.length - 1 &&
                                            styles.dropdownOptionBorder,
                                            selected && styles.selectedOption,
                                            pressed && styles.pressed,
                                        ]}
                                        onPress={() => selectExercise(exercise)}
                                    >
                                        <Ionicons
                                            name="barbell-outline"
                                            size={21}
                                            color="black"
                                        />

                                        <Text
                                            style={[
                                                styles.optionText,
                                                selected && styles.selectedOptionText,
                                            ]}
                                        >
                                            {exercise}
                                        </Text>

                                        {selected && (
                                            <Feather
                                                name="check"
                                                size={20}
                                                color="black"
                                                style={styles.checkIcon}
                                            />
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>
                    )}
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Select workout video"
                    onPress={onSelectVideo}
                    style={({ pressed }) => [
                        styles.uploadArea,
                        pressed && styles.uploadAreaPressed,
                    ]}
                    disabled={hasSelectedVideo}
                >
                    {!hasSelectedVideo && <View style={styles.videoIconContainer}>
                        <Feather name="video" size={35} color="white" />
                    </View>}

                    {!hasSelectedVideo && <Text style={styles.uploadTitle}>
                        Upload Workout Video</Text>}

                    {hasSelectedVideo &&
                        <View style={styles.videoContainer}>
                            <VideoPreview uri={selectedVideo?.uri ?? ""}/>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Remove selected video"
                                hitSlop={10}
                                onPress={() => setSelectedVideo(null)}
                                style={({ pressed }) => [
                                    styles.removeButton,
                                    pressed && styles.removeButtonPressed,
                                ]}
                            >
                                <Feather name="x" size={20} color="#FFFFFF" />
                            </Pressable>
                        </View>
                    }

                    {!hasSelectedVideo && (
                        <View style={styles.tip}>
                            <Feather
                                name="info"
                                size={15}
                                color="#626773"
                            />

                            <Text style={styles.tipText}>
                                Ensure your side profile is visible
                            </Text>
                        </View>
                    )}
                </Pressable>

                <Pressable
                    accessibilityRole="button"
                    disabled={!hasSelectedVideo}
                    onPress={() => onSubmit(selectedExercise)}
                    style={({ pressed }) => [
                        styles.submitButton,
                        !hasSelectedVideo && styles.submitButtonDisabled,
                        pressed &&
                        hasSelectedVideo &&
                        styles.submitButtonPressed,
                    ]}
                >
                    <Text style={styles.submitButtonText}>
                        Submit for Form Analysis
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FAF9F7",
    },

    screen: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 36,
    },

    title: {
        marginBottom: 30,
        color: "#17181C",
        fontSize: 27,
        fontWeight: "700",
        letterSpacing: -0.5,
    },

    fieldLabel: {
        marginBottom: 9,
        color: "#555964",
        fontSize: 14,
        fontWeight: "700",
    },

    dropdownWrapper: {
        position: "relative",
        zIndex: 10,
        marginBottom: 28,
    },

    dropdownButton: {
        height: 64,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D8E1EB",
        borderRadius: 17,
    },

    dropdownButtonOpen: {
        borderColor: "#078ECC",
    },

    dropdownSelection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    dropdownText: {
        color: "#282A30",
        fontSize: 17,
        fontWeight: "600",
    },

    dropdownMenu: {
        position: "absolute",
        top: 72,
        right: 0,
        left: 0,

        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D8E1EB",
        borderRadius: 17,

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 8,
    },

    dropdownOption: {
        minHeight: 57,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    dropdownOptionBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E5E8ED",
    },

    selectedOption: {
        backgroundColor: "#B8B8FF",
    },

    optionText: {
        color: "#282A30",
        fontSize: 16,
        fontWeight: "500",
    },

    selectedOptionText: {
        color: "black",
        fontWeight: "700",
    },

    checkIcon: {
        marginLeft: "auto",
    },

    uploadArea: {
        minHeight: 340,
        paddingHorizontal: 0,
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#5C5CFF",
        borderRadius: 27,
    },

    uploadAreaPressed: {
        backgroundColor: "#B8B8FF",
    },

    videoIconContainer: {
        width: 88,
        height: 88,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#5C5CFF",
        borderRadius: 44,
    },

    uploadTitle: {
        marginBottom: 5,
        color: "#202126",
        fontSize: 19,
        fontWeight: "700",
    },

    uploadDescription: {
        maxWidth: "100%",
        color: "#626773",
        fontSize: 15,
    },

    selectedVideoName: {
        color: "#078ECC",
        fontWeight: "600",
    },

    tip: {
        marginTop: 18,
        paddingHorizontal: 14,
        paddingVertical: 7,
        flexDirection: "row",
        alignItems: "center",
        gap: 7,

        backgroundColor: "#F7F6F3",
        borderRadius: 18,
    },

    tipText: {
        color: "#626773",
        fontSize: 13,
        fontWeight: "600",
    },

    submitButton: {
        height: 65,
        marginTop: 52,
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#5C5CFF",
        borderRadius: 22,
    },

    submitButtonDisabled: {
        opacity: 0.55,
    },

    submitButtonPressed: {
        backgroundColor: "#0000FF",
        transform: [{ scale: 0.99 }],
    },

    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },

    pressed: {
        opacity: 0.75,
    },

    removeButton: {
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 10,

        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 18,
    },

    removeButtonPressed: {
        opacity: 0.75,
        transform: [{ scale: 0.92 }],
    },

    videoContainer: {
        width: "100%",
        position: "relative",
    },
});