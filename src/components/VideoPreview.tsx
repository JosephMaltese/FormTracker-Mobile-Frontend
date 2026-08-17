import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import {StyleSheet} from "react-native";

export default function VideoPreview({ uri }: { uri: string }) {
    const player = useVideoPlayer(uri, (player) => {
        player.loop = true;
        player.muted = true;
        player.audioMixingMode = "mixWithOthers";
    });

    return (
        <VideoView
            player={player}
            style={styles.videoPreview}
            nativeControls
            contentFit={"cover"}
        />
    );
}

const styles = StyleSheet.create({
    videoPreview: {
        width: "100%",
        height: 340,
        backgroundColor: "#111111",
        borderRadius: 27,
        overflow: "hidden",
    },
})