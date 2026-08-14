interface ScoreDataPoint {
    uploaded_at: string,
    score: number,
    exercise_type: string,
}

interface ProgressDataPoint {
    value: number,
    label: string,
}

interface ProgressChartProps {
    average_score: number,
    data_points: ProgressDataPoint[],
}

export { ScoreDataPoint, ProgressChartProps };