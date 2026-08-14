import {ProgressChartProps, ScoreDataPoint} from "@/lib/interfaces";

type GroupedScoreData = Record<string, ScoreDataPoint[]>;

type GroupedProgressChartProps = Record<string, ProgressChartProps[]>

export { GroupedScoreData, GroupedProgressChartProps };