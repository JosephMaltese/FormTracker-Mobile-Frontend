import { View, Text, StyleSheet } from "react-native";
import Body from "react-native-body-highlighter";
import {
    musclesFrontOnly,
    musclesBackOnly,
    musclesBothSides,
    intensityColorsHex,
    defaultBodyColorHex,
} from "@/lib/constants";

export default function MuscleDiagram() {
    const totalFrontMuscles = [...musclesFrontOnly, ...musclesBothSides];
    const totalBackMuscles = [...musclesBackOnly, ...musclesBothSides];

    const frontData = [
        ...totalFrontMuscles.map((slug) => ({
            slug,
            styles: { fill: defaultBodyColorHex },
        })),
        {
            slug: "chest" as const,
            side: "left" as const,
            intensity: 1,
        },
        {
            slug: "biceps" as const,
            intensity: 2,
        },
        {
            slug: "abs" as const,
            intensity: 3,
        },
    ];

    const backData = [
        ...totalBackMuscles.map((slug) => ({
            slug,
            styles: { fill: defaultBodyColorHex },
        })),
        {
            slug: "upper-back" as const,
            intensity: 2,
        },
    ];

    return (
        <View style={styles.outerContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.mainText}>Muscle Map</Text>
                <Text style={styles.secondaryText}>Highlighting muscles engaged this week with adequate form.</Text>
                <View style={styles.compassRow}>
                    <View style={styles.circleBlue} />
                    <Text>Trained</Text>
                </View>
                <View style={styles.compassRow}>
                    <View style={styles.circleGrey} />
                    <Text>Pending training</Text>
                </View>
            </View>
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
    mainText: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 15,
    },
    secondaryText: {
        color: "#696969",
    },
    circleBlue: {
        width: 11,
        height: 11,
        borderRadius: 17,
        backgroundColor: "#0000FF",
        marginRight: 3,
    },
    circleGrey: {
        width: 11,
        height: 11,
        borderRadius: 17,
        backgroundColor: "#989898",
        marginRight: 3,
    },
    compassRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
    },
    textContainer: {
        maxWidth: "40%"
    }

});