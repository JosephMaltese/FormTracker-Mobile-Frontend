import {StyleSheet, Text, View} from 'react-native';
import PeriodSelector, {ProgressPeriod} from "@/components/PeriodSelector";
import ProgressChart from "@/components/ProgressChart";
import {useEffect, useState} from "react";
import {ProgressChartProps, ProgressDataPoint, ScoreDataPoint} from "@/lib/interfaces";
import {GroupedProgressChartProps, GroupedScoreData} from "@/lib/types";
import {TimePeriod} from "@/lib/enums";
import {exerciseEnumToDisplayName, supportedExercises} from "@/lib/constants";
import NoChartData from "@/components/NoChartData";

const monthIdxToDisplayName: Record<number, string> = {
    0: "Jan",
    1: "Feb",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
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

function mapThirtyDayData(dataPoints: ScoreDataPoint[]): ProgressDataPoint[] {
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = 7 * dayMs;

    const rangeEnd = new Date(now);
    const rangeStart = new Date(now);

    rangeStart.setUTCDate(rangeStart.getUTCDate() - 29);
    rangeStart.setUTCHours(0, 0, 0, 0);

    const buckets = Array.from({ length: 5 }, () => ({
        total: 0,
        count: 0,
    }));

    for (const point of dataPoints) {
        const timestamp = new Date(point.uploaded_at).getTime();

        // Ignore data outside the 30-day range
        if (
            timestamp < rangeStart.getTime() ||
            timestamp > rangeEnd.getTime()
        ) {
            continue;
        }

        const elapsed = timestamp - rangeStart.getTime();
        const weekIndex = Math.floor(elapsed / weekMs);

        buckets[weekIndex].total += point.score;
        buckets[weekIndex].count++;
    }

    return buckets.map((bucket, index) => ({
        label: `Week ${index + 1}`,
        value: bucket.count > 0
            ? bucket.total / bucket.count
            : 0,
    }));
}

function mapYearData(dataPoints: ScoreDataPoint[]): ProgressDataPoint[] {
    const months = Array.from({ length: 12 }, () => ({
        total: 0,
        count: 0,
    }));

    for (const point of dataPoints) {
        const pointDate = new Date(point.uploaded_at);
        const pointMonth = pointDate.getMonth();

        months[pointMonth].total += point.score;
        months[pointMonth].count++;
    }

    return months.map((month, index) => ({
        label: monthIdxToDisplayName[index],
        value: month.count > 0
            ? month.total / month.count
            : 0,
    }));
}

function mapDataPoints (dataPoints: ScoreDataPoint[], timePeriod: TimePeriod): ProgressDataPoint[] {
    dataPoints.sort((a,b) => a["uploaded_at"].localeCompare(b["uploaded_at"]));

    if (timePeriod === TimePeriod.SevenDays) {
        const mappedPoints = dataPoints.map((point) => {
            const label = convertISOToDayLabel(point.uploaded_at);
            return {
                value: point.score,
                label: label,
            } as ProgressDataPoint;
        });

        return mappedPoints;
    } else if (timePeriod === TimePeriod.ThirtyDays) {
        return mapThirtyDayData(dataPoints);
    } // 1 Year
    else {
        return mapYearData(dataPoints);
    }
}

export default function ProgressCharts({ sevenDaysData, thirtyDaysData, yearData  }: { sevenDaysData: ScoreDataPoint[], thirtyDaysData: ScoreDataPoint[], yearData: ScoreDataPoint[] }) {
    const [sevenDaysProps, setSevenDaysProps] = useState<GroupedProgressChartProps>({});
    const [thirtyDaysProps, setThirtyDaysProps] = useState<GroupedProgressChartProps>({});
    const [yearProps, setYearProps] = useState<GroupedProgressChartProps>({});

    function prepareData(data: GroupedScoreData, timePeriod: TimePeriod) {
        const rec: GroupedProgressChartProps = {};
        for (const [exerciseName, dataPoints] of Object.entries(data)) {


            const mappedDataPoints = mapDataPoints(dataPoints, timePeriod);
            const scores = mappedDataPoints.map((point) => point.value);
            const scoresSum = scores.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const avgScore = scoresSum / scores.length;
            rec[exerciseName] = {
                average_score: avgScore,
                data_points: mappedDataPoints,
            } as ProgressChartProps;
        }
        switch (timePeriod) {
            case TimePeriod.SevenDays:
                setSevenDaysProps(rec);
                break;
            case TimePeriod.ThirtyDays:
                setThirtyDaysProps(rec);
                break;
            case TimePeriod.Year:
                setYearProps(rec);
                break;
        }
    }

    useEffect(() => {
        const groupedSevenDaysData = groupByExercise(sevenDaysData);
        const groupedThirtyDaysData = groupByExercise(thirtyDaysData);
        const groupedYearData = groupByExercise(yearData);

        prepareData(groupedSevenDaysData, TimePeriod.SevenDays);
        prepareData(groupedThirtyDaysData, TimePeriod.ThirtyDays);
        prepareData(groupedYearData, TimePeriod.Year);
    }, [sevenDaysData, thirtyDaysData, yearData]);

    const [period, setPeriod] = useState<ProgressPeriod>("7d");
    return (
        <View style={styles.outerView}>
            <View style={styles.headingView}>
                <Text style={styles.titleText}>Form Progress</Text>
                <PeriodSelector value={period} onChange={setPeriod} />
            </View>
            {period === "7d" && Object.entries(sevenDaysProps).map(([exerciseName, props], index) => (
                <View key={index}>
                    <ProgressChart
                        exerciseName={exerciseEnumToDisplayName[exerciseName] || exerciseName}
                        average={props.average_score}
                        data={props.data_points}
                    />

                </View>
            ))}
            {period === "7d" && supportedExercises.filter((exerciseName) => !Object.keys(sevenDaysProps).includes(exerciseName)).map((exerciseName) => (
                <NoChartData name={exerciseEnumToDisplayName[exerciseName] || exerciseName} periodLabel={"this week"} key={exerciseName}/>
            ))
            }
            {period === "30d" && Object.entries(thirtyDaysProps).map(([exerciseName, props], index) => (
                <View key={index}>
                    <ProgressChart
                        exerciseName={exerciseEnumToDisplayName[exerciseName] || exerciseName}
                        average={props.average_score}
                        data={props.data_points}
                    />

                </View>
            ))}
            {period === "30d" && supportedExercises.filter((exerciseName) => !Object.keys(thirtyDaysProps).includes(exerciseName)).map((exerciseName) => (
                <NoChartData name={exerciseEnumToDisplayName[exerciseName] || exerciseName} periodLabel={"this month"} key={exerciseName}/>
            ))
            }
            {period === "1y" && Object.entries(yearProps).map(([exerciseName, props], index) => (
                <View key={index}>
                    <ProgressChart
                        exerciseName={exerciseEnumToDisplayName[exerciseName] || exerciseName}
                        average={props.average_score}
                        data={props.data_points}
                    />

                </View>
            ))}
            {period === "1y" && supportedExercises.filter((exerciseName) => !Object.keys(yearProps).includes(exerciseName)).map((exerciseName) => (
                <NoChartData name={exerciseEnumToDisplayName[exerciseName] || exerciseName} periodLabel={"this year"} key={exerciseName}/>
            ))
            }
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