import {APIExercise, Exercise, MusclesTrained} from "@/lib/types";

const musclesFrontOnly = [
    "tibialis",
    "obliques",
    "chest",
    "biceps",
    "abs",
    "quadriceps",
    "knees"
];
const musclesBackOnly = [
    "adductors",
    "upper-back",
    "lower-back",
    "hamstring",
    "gluteal"
];
const musclesBothSides = [
    "trapezius",
    "triceps",
    "forearm",
    "adductors",
    "calves",
    "hair",
    "neck",
    "deltoids",
    "hands",
    "feet",
    "head",
    "ankles"
];

const supportedExercises = [
    "BICEP CURL",
    "BENCH PRESS",
    "SQUAT"
];

const exerciseEnumToDisplayName: Record<string, Exercise> = {
    "BICEP CURL": "Bicep Curl",
    "BENCH PRESS": "Bench Press",
    "SQUAT": "Squat",
}

const exerciseMuscles: Record<string, MusclesTrained> = {
    "BICEP CURL": {
        primary: [],
        secondary: []
    },
    "BENCH PRESS": {
        primary: [],
        secondary: []
    },
    "SQUAT": {
        primary: ["quadriceps", "gluteal", "adductors"],
        secondary: ["abs", "hamstring", "calves"]
    }
}

const intensityColorsHex = ["#B8B8FF", "#5C5CFF", "#0000FF"];

const progressChartPointColorHex = "#0000FF";
const progressChartLineColorHex = "#5C5CFF";

const appBackgroundColorHexLight = "#FAF9F6" as const;
const appBackgroundColorHexDark = "#09090B" as const;

const defaultBodyColorHex = "#989898" as const;

const apiURL = "http://127.0.0.1:8000/analyze-video/";

export {
    musclesFrontOnly,
    musclesBackOnly,
    musclesBothSides,
    intensityColorsHex,
    defaultBodyColorHex,
    appBackgroundColorHexLight,
    appBackgroundColorHexDark,
    progressChartLineColorHex,
    progressChartPointColorHex,
    supportedExercises,
    apiURL,
    exerciseEnumToDisplayName,
    exerciseMuscles,
};