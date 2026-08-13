import AuthProvider, { useAuthSession } from "@/providers/AuthProvider";
import { Stack } from "expo-router";
import { ReactNode } from "react";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "expo-router/react-navigation";
import { useColorScheme } from "react-native";
import { appBackgroundColorHexLight} from "@/lib/constants";

export default function RootLayout(): ReactNode {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme }>
            <AuthProvider>
                <RootNav backgroundColor={ isDark ? "" : appBackgroundColorHexLight }/>
            </AuthProvider>
        </ThemeProvider>
    );
}

function RootNav({
    backgroundColor,
}: {
    backgroundColor: string;
}): ReactNode {
    const { session } = useAuthSession();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "none",
                contentStyle: {
                    backgroundColor
                },
            }}
        >
            <Stack.Protected guard={!session}>
                <Stack.Screen name="index"></Stack.Screen>
                <Stack.Screen name="login"></Stack.Screen>
            </Stack.Protected>

            <Stack.Protected guard={!!session}>
                <Stack.Screen name="(authorized)" />
            </Stack.Protected>
        </Stack>
    );
}
