import { View, Text, StyleSheet } from "react-native";
import Body from "react-native-body-highlighter";

export default function MuscleDiagram() {
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
                    <View style={styles.circleRed} />
                    <Text>Pending training</Text>
                </View>
            </View>
            <Body
                    data={[
                        { slug: "chest", intensity: 1, side: "left" },
                        { slug: "biceps", intensity: 2 },
                    ]}
                    gender="male"
                    side="front"
                    scale={0.6}
                    border="#dfdfdf"
                    defaultFill="#F0F0F0"
            />
            <Body
                    data={[
                        { slug: "chest", intensity: 1, side: "left" },
                        { slug: "biceps", intensity: 2 },
                    ]}
                    gender="male"
                    side="back"
                    scale={0.6}
                    border="#dfdfdf"
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
        backgroundColor: "#058BC4",
        marginRight: 3,
    },
    circleRed: {
        width: 11,
        height: 11,
        borderRadius: 17,
        backgroundColor: "red",
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