import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    LayoutChangeEvent,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { progressChartLineColorHex, progressChartPointColorHex } from "@/lib/constants";

type ProgressChartProps = {
    exerciseName: string;
    average: number;
    data: Array<{
        value: number;
        label?: string;
    }>;
};

export default function ProgressChart({
    exerciseName,
    average,
    data,
}: ProgressChartProps) {
    const [chartWidth, setChartWidth] = useState(0);

    const availableWidth = Math.max(chartWidth - 10, 0);
    const initialSpacing = 12;
    const endSpacing = 45;

    const pointSpacing =
        data.length > 1
            ? (availableWidth - initialSpacing - endSpacing) /
            (data.length - 1)
            : 0;

    function handleChartLayout(event: LayoutChangeEvent) {
        setChartWidth(event.nativeEvent.layout.width);
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.titleGroup}>
                    <View style={styles.accent} />

                    <Text style={styles.title} numberOfLines={2}>
                        {exerciseName} (Form Score)
                    </Text>
                </View>

                <Text style={styles.average}>
                    Avg: {Math.round(average)}%
                </Text>
            </View>

            <View
                style={styles.chartContainer}
                onLayout={handleChartLayout}
            >
                {availableWidth > 0 && (
                    <LineChart
                        width={availableWidth}
                        height={180}
                        data={data}
                        color={progressChartLineColorHex}
                        thickness={4}
                        dataPointsColor={progressChartPointColorHex}
                        dataPointsRadius={5}
                        hideYAxisText
                        yAxisLabelWidth={0}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        hideRules
                        disableScroll
                        initialSpacing={initialSpacing}
                        endSpacing={endSpacing}
                        spacing={pointSpacing}
                        xAxisLabelTextStyle={{
                            color: "#171717",
                            fontSize: 13,
                            textAlign: "center",
                        }}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        backgroundColor: "#FFF",
        borderRadius: 28,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        padding: 20,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    titleGroup: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 12,
    },

    accent: {
        width: 6,
        height: 26,
        marginRight: 10,
        borderRadius: 3,
        backgroundColor: progressChartLineColorHex,
    },

    title: {
        flex: 1,
        color: "#171717",
        fontSize: 13,
        fontWeight: "700",
    },

    average: {
        flexShrink: 0,
        color: progressChartLineColorHex,
        fontSize: 15,
        fontWeight: "600",
    },

    chartContainer: {
        width: "100%",
        overflow: "hidden",
    },
});