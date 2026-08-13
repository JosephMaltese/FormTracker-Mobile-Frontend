const musclesFrontOnly = [
    "tibialis",
    "obliques",
    "chest",
    "biceps",
    "abs",
    "quadriceps",
    "knees"
] as const;
const musclesBackOnly = [
    "adductors",
    "upper-back",
    "lower-back",
    "hamstring",
    "gluteal"
] as const;
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
] as const;

const intensityColorsHex = ["#B8B8FF", "#5C5CFF", "#0000FF"];

const defaultBodyColorHex = "#989898" as const;

export {
    musclesFrontOnly,
    musclesBackOnly,
    musclesBothSides,
    intensityColorsHex,
    defaultBodyColorHex,
};