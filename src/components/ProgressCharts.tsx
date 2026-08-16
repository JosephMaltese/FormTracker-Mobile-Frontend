import { View, Text, StyleSheet } from 'react-native';
import PeriodSelector, {ProgressPeriod} from "@/components/PeriodSelector";
import ProgressChart from "@/components/ProgressChart";
import {useEffect, useState} from "react";
import {ScoreDataPoint, ProgressChartProps, ProgressDataPoint} from "@/lib/interfaces";
import {GroupedProgressChartProps, GroupedScoreData} from "@/lib/types";

const exerciseEnumToDisplayName: Record<string, string> = {
    "BICEP CURL": "Bicep Curl",
    "BENCH PRESS": "Bench Press",
    "SQUAT": "Squat",
}

function groupByExercise(data: ScoreDataPoint[]): GroupedScoreData {
    return data.reduce<GroupedScoreData>((groups, dataPoint) => {
        const exerciseType = dataPoint.exercise_type;

        if (!groups[exerciseType]) {
            groups[exerciseType] = [];
        }

        groups[exerciseType].push(dataPoint);
        return groups;
    }, {});
}

function convertISOToDayLabel(isoString: string): string {
    const date = new Date(isoString);
    const weekday = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        timeZone: "UTC",
    }).format(date);
    return weekday;
}

function mapDataPoints (dataPoints: ScoreDataPoint[]): ProgressDataPoint[] {
    dataPoints.sort((a,b) => a["uploaded_at"].localeCompare(b["uploaded_at"]));
    const mappedPoints = dataPoints.map((point) => {
        const label = convertISOToDayLabel(point.uploaded_at);
        return {
            value: point.score,
            label: label,
        } as ProgressDataPoint;
    });

    return mappedPoints;
}

export default function ProgressCharts({ sevenDaysData, thirtyDaysData, yearData  }: { sevenDaysData: ScoreDataPoint[], thirtyDaysData: ScoreDataPoint[], yearData: ScoreDataPoint[] }) {
    const [sevenDaysProps, setSevenDaysProps] = useState<GroupedProgressChartProps>({});

    function prepareSevenDaysData(data: GroupedScoreData) {
        const rec: GroupedProgressChartProps = {};
        for (const [exerciseName, dataPoints] of Object.entries(data)) {


            const mappedDataPoints = mapDataPoints(dataPoints);
            const scores = mappedDataPoints.map((point) => point.value);
            const scoresSum = scores.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const avgScore = scoresSum / scores.length;
            rec[exerciseName] = {
                average_score: avgScore,
                data_points: mappedDataPoints,
            } as ProgressChartProps;
        }
        setSevenDaysProps(rec);
    }

    useEffect(() => {
        const groupedSevenDaysData = groupByExercise(sevenDaysData);
        const groupedThirtyDaysData = groupByExercise(thirtyDaysData);
        const groupedYearData = groupByExercise(yearData);

        prepareSevenDaysData(groupedSevenDaysData);
    }, [sevenDaysData, thirtyDaysData, yearData]);

    const [period, setPeriod] = useState<ProgressPeriod>("7d");
    return (
        <View style={styles.outerView}>
            <View style={styles.headingView}>
                <Text style={styles.titleText}>Form Progress</Text>
                <PeriodSelector value={period} onChange={setPeriod} />
            </View>
            {Object.entries(sevenDaysProps).map(([exerciseName, props], index) => (
                <View key={index}>
                    <ProgressChart
                        exerciseName={exerciseEnumToDisplayName[exerciseName] || exerciseName}
                        average={props.average_score}
                        data={props.data_points}
                    />

                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    outerView: {
        marginTop: 20
    },
    headingView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    titleText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    chartView: {
        marginBottom: 20,
    },
});