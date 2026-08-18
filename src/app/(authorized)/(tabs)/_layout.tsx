import { Tabs } from "expo-router";
import { ReactNode } from "react";
import { useColorScheme } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";

import {
    appBackgroundColorHexDark,
    appBackgroundColorHexLight,
} from "@/lib/constants";

export default function TabsLayout(): ReactNode {
    const isDark = useColorScheme() === "dark";

    const backgroundColor = isDark
        ? appBackgroundColorHexDark
        : appBackgroundColorHexLight;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2563EB",
                sceneStyle: {
                    backgroundColor,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <Octicons name="home" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="activity"
                options={{
                    title: "Activity",
                    tabBarIcon: ({ color }) => (
                        <Octicons name="pulse" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="new"
                options={{
                    title: "New",
                    tabBarIcon: ({ color }) => (
                        <Octicons
                            name="plus-circle"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <Octicons name="person" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}