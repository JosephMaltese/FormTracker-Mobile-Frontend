import {ProgressChartProps, ScoreDataPoint} from "@/lib/interfaces";

type GroupedScoreData = Record<string, ScoreDataPoint[]>;

type GroupedProgressChartProps = Record<string, ProgressChartProps>

type SelectedVideo = {
    uri: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    duration: number | null;
}

export { GroupedScoreData, GroupedProgressChartProps, SelectedVideo };