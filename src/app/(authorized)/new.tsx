import React, { useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {SelectedVideo} from "@/lib/types";
import * as ImagePicker from "expo-image-picker";

type Exercise = "Bicep Curl" | "Bench Press" | "Squat";

const exerciseOptions: Exercise[] = [
    "Bicep Curl",
    "Bench Press",
    "Squat",
];


export default function NewScreen() {
    const [selectedExercise, setSelectedExercise] =
        useState<Exercise>("Squat");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [hasSelectedVideo, setHasSelectedVideo] = useState<boolean>(false);

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

        setHasSelectedVideo(true);
    }

    async function onSubmit(exercise: Exercise) {
        console.log("SUBMITTED");
        console.log(exercise);
        console.log(selectedVideo?.fileName);
        return;
    }

    function selectExercise(exercise: Exercise) {
        setSelectedExercise(exercise);
        setDropdownOpen(false);
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
                                color="#B8B8FF"
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
                                            color="white"
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
                                                color="white"
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
                >
                    <View style={styles.videoIconContainer}>
                        <Feather name="video" size={35} color="white" />
                    </View>

                    <Text style={styles.uploadTitle}>
                        {hasSelectedVideo
                            ? "Workout Video Selected"
                            : "Upload Workout Video"}
                    </Text>

                    <Text
                        numberOfLines={1}
                        style={[
                            styles.uploadDescription,
                            hasSelectedVideo && styles.selectedVideoName,
                        ]}
                    >
                        {hasSelectedVideo
                            ? selectedVideo?.fileName ?? "Video ready to upload"
                            : ""}
                    </Text>

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
                        Submit for AI Analysis
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
        paddingTop: 72,
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
        color: "white",
        fontWeight: "700",
    },

    checkIcon: {
        marginLeft: "auto",
    },

    uploadArea: {
        minHeight: 340,
        paddingHorizontal: 24,
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

        backgroundColor: "#B8B8FF",
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
        marginTop: 28,
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
});