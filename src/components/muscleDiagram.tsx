import { View, StyleSheet } from "react-native";
import Body, { ExtendedBodyPart } from "react-native-body-highlighter";
import {
    musclesFrontOnly,
    musclesBackOnly,
    musclesBothSides,
    intensityColorsHex,
    defaultBodyColorHex,
} from "@/lib/constants";

export default function MuscleDiagram({ frontMusclesTrained, backMusclesTrained } : { frontMusclesTrained: ExtendedBodyPart[], backMusclesTrained: ExtendedBodyPart[] }) {
    const totalFrontMuscles = [...musclesFrontOnly, ...musclesBothSides];
    const totalBackMuscles = [...musclesBackOnly, ...musclesBothSides];

    const frontData = [
        ...totalFrontMuscles.map((slug) => ({
            slug,
            styles: { fill: defaultBodyColorHex },
        } as ExtendedBodyPart)),
        ...frontMusclesTrained,
    ];

    const backData = [
        ...totalBackMuscles.map((slug) => ({
            slug,
            styles: { fill: defaultBodyColorHex },
        })),
        ...backMusclesTrained,
    ];

    return (
        <View style={styles.outerContainer}>
            <Body
                data={frontData}
                gender="male"
                side="front"
                scale={0.5}
                border="none"
                colors={intensityColorsHex}
            />
            <Body
                data={backData}
                gender="male"
                side="back"
                scale={0.5}
                border="none"
                colors={intensityColorsHex}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderRadius: 15,
        padding: 15,
        borderColor: "#E2E8F0",
        display: "flex",
        flexDirection: "row",
    },
});