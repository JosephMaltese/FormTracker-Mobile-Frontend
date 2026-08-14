import { Pressable, StyleSheet, Text, View } from "react-native";

export type ProgressPeriod = "7d" | "30d" | "1y";

type PeriodSelectorProps = {
    value: ProgressPeriod;
    onChange: (period: ProgressPeriod) => void;
};

const options: Array<{
    label: string;
    value: ProgressPeriod;
}> = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "1 Year", value: "1y" },
];

export default function PeriodSelector({value, onChange}: PeriodSelectorProps) {
    return (
        <View
            style={styles.container}
            accessibilityRole="tablist"
        >
            {options.map((option) => {
                const isSelected = value === option.value;

                return (
                    <Pressable
                        key={option.value}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: isSelected }}
                        onPress={() => onChange(option.value)}
                        style={({ pressed }) => [
                            styles.option,
                            isSelected && styles.selectedOption,
                            pressed && styles.pressedOption,
                        ]}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                isSelected && styles.selectedOptionText,
                            ]}
                        >
                            {option.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        padding: 4,
        backgroundColor: "#E4EAF3",
        borderRadius: 24,
    },

    option: {
        minHeight: 20,
        minWidth: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
        borderRadius: 20,
    },

    selectedOption: {
        backgroundColor: "#FFFFFF",

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 3,

        elevation: 2,
    },

    pressedOption: {
        opacity: 0.7,
    },

    optionText: {
        color: "#565A64",
        fontSize: 12,
        fontWeight: "500",
    },

    selectedOptionText: {
        color: "#171717",
        fontWeight: "700",
    },
});