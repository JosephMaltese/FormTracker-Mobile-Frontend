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
    const { token, isLoading } = useAuthSession();
    console.log('RootLayoutContent: token=', token, 'isLoading=', isLoading);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    };

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "none",
            }}
        >
            <Stack.Protected guard={!token}>
                <Stack.Screen name="index"></Stack.Screen>
                <Stack.Screen name="login"></Stack.Screen>
            </Stack.Protected>

            <Stack.Protected guard={!!token}>
                <Stack.Screen name="(authorized)" />
            </Stack.Protected>

        </Stack>
    );
}
