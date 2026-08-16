import { View, Text, StyleSheet } from "react-native";


export default function NoChartData({ name, periodLabel }: { name: string, periodLabel: string }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.accent} />

                <Text style={styles.exerciseName}>
                    {name} (Form Score)
                </Text>
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>↗</Text>
                </View>

                <Text style={styles.title}>
                    No activity {periodLabel}
                </Text>

                <Text style={styles.description}>
                    Complete a {name} session to start{"\n"}
                    tracking your form progress.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        minHeight: 310,
        paddingHorizontal: 28,
        paddingTop: 28,
        paddingBottom: 24,

        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#DDE3ED",
        borderRadius: 28,
        marginBottom: 12,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
    },

    accent: {
        width: 8,
        height: 38,
        marginRight: 16,

        backgroundColor: "#5B57FF",
        borderRadius: 4,
    },

    exerciseName: {
        flexShrink: 1,
        color: "#13151A",
        fontSize: 13,
        fontWeight: "700",
    },

    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
    },

    iconContainer: {
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,

        backgroundColor: "#F0EFFF",
        borderRadius: 24,
    },

    icon: {
        color: "#5B57FF",
        fontSize: 30,
        fontWeight: "600",
        lineHeight: 34,
    },

    title: {
        marginBottom: 8,

        color: "#13151A",
        fontSize: 15,
        fontWeight: "700",
        textAlign: "center",
    },

    description: {
        color: "#7A8190",
        fontSize: 15,
        lineHeight: 21,
        textAlign: "center",
    },
});