import { Stack } from "expo-router";
import { ReactNode } from "react";
import { useColorScheme } from "react-native";

import {
    appBackgroundColorHexDark,
    appBackgroundColorHexLight,
} from "@/lib/constants";

export default function AuthorizedLayout(): ReactNode {
    const isDark = useColorScheme() === "dark";

    const backgroundColor = isDark
        ? appBackgroundColorHexDark
        : appBackgroundColorHexLight;

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor,
                },
            }}
        >
            <Stack.Screen name="(tabs)" />

            <Stack.Screen
                name="analysis/[videoId]"
                options={{
                    animation: "slide_from_right",
                }}
            />
        </Stack>
    );
}