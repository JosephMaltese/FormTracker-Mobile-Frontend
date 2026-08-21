import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {useEffect, useState} from "react";
import {router, useLocalSearchParams} from "expo-router";
import supabase from "@/lib/subabaseClient";
import {SummaryPageAnalysis} from "@/lib/types";
import {Ionicons} from "@expo/vector-icons";
import Svg, {Circle} from "react-native-svg";
import VideoPreview from "@/components/VideoPreview";
import DumbbellSpinner from "@/components/dumbbellSpinner";
import MuscleDiagram from "@/components/muscleDiagram";

const COLORS = {
    background: "#F8F7F4",
    card: "#FFFFFF",
    ink: "#1D1D21",
    muted: "#66666F",
    line: "#DCE3EA",
    blue: "#078DC8",
    paleBlue: "#DDF2FC",
};

function ScoreRing({ score }: { score: number }) {
    const size = 82;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(100, score));

    return (
        <View style={styles.scoreRing}>
            <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E7EDF2"
                    strokeWidth={strokeWidth}
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={COLORS.blue}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={circumference * (1 - progress / 100)}
                    strokeLinecap="butt"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <Text style={styles.scoreNumber}>{Math.round(progress)}</Text>
        </View>
    );
}

export default function AnalysisScreen() {
    const { videoId } = useLocalSearchParams<{ videoId: string }>();
    const [analysis, setAnalysis] = useState<SummaryPageAnalysis | null>(null);
    const [analyzedVideoUrl, setAnalyzedVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        if (!videoId) return;

        async function loadVideo() {
            const { data: video, error: videoError } = await supabase
                .from("videos")
                .select("*")
                .eq("id", Number(videoId))
                .single();

            if (videoError) {
                setError("We couldn't load this analysis.");
                setLoading(false);
                return;
            }

            setAnalysis({
                llmAnalysis: video.analysis,
                exerciseType: video.exercise_type,
                videoUrl: video.file_url,
                id: video.id,
                score: video.score,
                uploadedAt: video.uploaded_at,
                userId: video.user_id,
            } as SummaryPageAnalysis);

            if (!video.file_url) {
                console.error("Video has no storage path");
                return;
            }

            const { data: signedData, error: urlError } = await supabase.storage
                .from("videos")
                .createSignedUrl(video.file_url, 3600);

            if (urlError) {
                console.error("Failed to get video URL:", urlError);
                return;
            }

            console.log("Signed video URL:", signedData.signedUrl);
            setAnalyzedVideoUrl(signedData.signedUrl);
        }

        loadVideo().then(() => {});
        setLoading(false);
    }, [videoId]);

    if (loading) {
        return (
            <DumbbellSpinner />
        );
    }

    if (error || !analysis) {
        return (
            <SafeAreaView style={[styles.page, styles.centered]}>
                <Text style={styles.errorText}>{error ?? "Analysis not found."}</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.retryButton}>
                    <Text style={styles.retryText}>Go back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.page} edges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={27} color={COLORS.ink} />
                </TouchableOpacity>

                <View style={styles.headerTitleWrap}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{analysis.exerciseType}</Text>
                    <Text style={styles.headerDate}>
                        {new Date(analysis?.uploadedAt ?? "").toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </Text>
                </View>

                <TouchableOpacity hitSlop={12} style={styles.headerButton}>
                    <Ionicons name="share-outline" size={28} color={COLORS.ink} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.videoCard}>
                    {analyzedVideoUrl ? (
                        <VideoPreview uri={analyzedVideoUrl} />
                    ) : (
                        <View style={[styles.centered, styles.videoFallback]}>
                            <Ionicons name="videocam-outline" size={30} color={COLORS.muted} />
                            <Text style={styles.videoFallbackText}>Video unavailable</Text>
                        </View>
                    )}
                </View>

                <View style={[styles.card, styles.scoreCard]}>
                    <ScoreRing score={analysis.score} />
                    <View style={styles.scoreCopy}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {analysis.score >= 85 ? "GOOD FORM" : analysis.score >= 70 ? "SOLID EFFORT" : "KEEP WORKING"}
                            </Text>
                        </View>
                        <Text style={styles.scoreTitle}>Form Score: {Math.round(analysis.score)}/100</Text>
                        <Text style={styles.scoreSubtitle}>Your movement quality from this lift.</Text>
                    </View>
                </View>

                <View style={[styles.card, styles.feedbackCard]}>
                    <Text style={styles.sectionTitle}>AI Feedback Summary</Text>
                    <View style={styles.feedbackList}>
                        {/*{display.feedback.map((item, index) => (*/}
                        {/*    <Text key={`${item.title}-${index}`} style={styles.feedbackText}>*/}
                        {/*        <Text style={styles.bullet}>• </Text>*/}
                        {/*        <Text style={styles.feedbackLabel}>{item.title}: </Text>*/}
                        {/*        {item.detail}*/}
                        {/*    </Text>*/}
                        {/*))}*/}
                        <Text>AI summary</Text>
                    </View>
                </View>

                <View style={styles.muscleCard}>
                    <View style={styles.muscleCopy}>
                        <Text style={styles.muscleTitle}>Primary Muscles Worked</Text>
                        <Text style={styles.muscleDescription}>display.muscleSummary</Text>
                    </View>
                    <View style={styles.diagramWrap}>
                        <MuscleDiagram frontMusclesTrained={[]} backMusclesTrained={[]} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: COLORS.background },
    centered: { alignItems: "center", justifyContent: "center" },
    header: {
        height: 72,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    headerButton: { width: 42, alignItems: "center", justifyContent: "center" },
    headerTitleWrap: { flex: 1, alignItems: "center", paddingHorizontal: 8 },
    headerTitle: { color: COLORS.ink, fontSize: 20, fontWeight: "700" },
    headerDate: { color: COLORS.muted, fontSize: 14, marginTop: 3 },
    content: { paddingHorizontal: 24, paddingBottom: 36, gap: 22 },
    videoCard: {
        height: 210,
        overflow: "hidden",
        borderRadius: 27,
        backgroundColor: "#DDE5EA",
    },
    videoFallback: { flex: 1 },
    videoFallbackText: { color: COLORS.muted, marginTop: 8 },
    card: {
        backgroundColor: COLORS.card,
        borderColor: COLORS.line,
        borderWidth: 1,
        borderRadius: 27,
    },
    scoreCard: {
        minHeight: 120,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 16,
    },
    scoreRing: { width: 82, height: 82, alignItems: "center", justifyContent: "center" },
    scoreNumber: { color: COLORS.ink, fontSize: 23, fontWeight: "800" },
    scoreCopy: { flex: 1, marginLeft: 18, alignItems: "flex-start" },
    badge: { backgroundColor: "#DDF4FF", borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4 },
    badgeText: { color: COLORS.blue, fontSize: 11, fontWeight: "800", letterSpacing: 0.2 },
    scoreTitle: { color: COLORS.ink, fontSize: 17, fontWeight: "700", marginTop: 7 },
    scoreSubtitle: { color: COLORS.muted, fontSize: 14, marginTop: 4 },
    feedbackCard: { paddingHorizontal: 17, paddingVertical: 19 },
    sectionTitle: { color: COLORS.ink, fontSize: 17, fontWeight: "700" },
    feedbackList: { marginTop: 10, gap: 8 },
    feedbackText: { color: COLORS.muted, fontSize: 14.5, lineHeight: 21 },
    feedbackLabel: { color: COLORS.ink, fontWeight: "700" },
    bullet: { color: COLORS.muted },
    muscleCard: {
        minHeight: 175,
        borderRadius: 27,
        backgroundColor: COLORS.paleBlue,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 20,
        overflow: "hidden",
    },
    muscleCopy: { flex: 1, paddingRight: 12 },
    muscleTitle: { color: "#0074A9", fontSize: 16, fontWeight: "700" },
    muscleDescription: { color: COLORS.muted, fontSize: 14, lineHeight: 20, marginTop: 8 },
    diagramWrap: { width: 88, height: 135, alignItems: "center", justifyContent: "center" },
    errorText: { color: COLORS.ink, fontSize: 16 },
    retryButton: { marginTop: 16, backgroundColor: COLORS.blue, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 12 },
    retryText: { color: "white", fontWeight: "700" },
});