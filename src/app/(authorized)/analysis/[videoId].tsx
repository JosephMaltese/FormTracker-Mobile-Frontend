import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {useEffect, useState} from "react";
import { useLocalSearchParams } from "expo-router";
import supabase from "@/lib/subabaseClient";
import {SummaryPageAnalysis} from "@/lib/types";

export default function AnalysisScreen() {
    const { videoId } = useLocalSearchParams<{ videoId: string }>();
    const [analysis, setAnalysis] = useState<SummaryPageAnalysis | null>(null);
    const [analyzedVideoUrl, setAnalyzedVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!videoId) return;

        async function loadVideo() {
            const { data: video, error: videoError } = await supabase
                .from("videos")
                .select("*")
                .eq("id", Number(videoId))
                .single();

            if (videoError) {
                console.error("Failed to get video:", videoError);
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
    }, [videoId]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.page}>
                <ScrollView>
                    <Text>Summary</Text>

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    page: {
        marginHorizontal: "5%",
        height: "100%",
    },
})