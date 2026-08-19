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

type RepAngleRange = {
    minAngle: number;
    maxAngle: number;
}

type VideoAnalysis = {
    totalScore: number;
    repCount: number;
    completeRomRepCount: number;
    partialRomRepCount: number;
    cheatRepCount: number;
    eccentricDurations: number[];
    minAndMaxRepAngles: RepAngleRange[];
    footCheatReps: number;
    toeKneeAlignedReps: number;
    horizontalThighReps: number;
}

export { GroupedScoreData, GroupedProgressChartProps, SelectedVideo, VideoAnalysis, RepAngleRange };