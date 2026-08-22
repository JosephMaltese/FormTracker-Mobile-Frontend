import { View, StyleSheet, Text } from "react-native";
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
        } as ExtendedBodyPart)),
        ...backMusclesTrained,
    ];

    return (
        <View style={styles.outerContainer}>
            <Text style={styles.titleText}>Muscles Trained</Text>
            <View style={styles.innerContainer}>
                <Body
                    data={frontData}
                    gender="male"
                    side="front"
                    scale={0.6}
                    border="none"
                    colors={intensityColorsHex}
                />
                <Body
                    data={backData}
                    gender="male"
                    side="back"
                    scale={0.6}
                    border="none"
                    colors={intensityColorsHex}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: "white",
        borderWidth: 2,
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 27,
        borderColor: "#E2E8F0",
    },
    innerContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    titleText: {
        fontSize: 17,
        fontWeight: "bold",
    }
});