import AuthProvider, { useAuthSession } from "@/providers/AuthProvider";
import { Stack, Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { ReactNode } from "react";
import { Slot } from "expo-router";

export default function RootLayout(): ReactNode {
    return (
        <AuthProvider>
            <RootNav />
        </AuthProvider>
    );
}

function RootNav(): ReactNode {
    const { session } = useAuthSession();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "none",
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
