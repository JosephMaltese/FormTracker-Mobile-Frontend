import { Tabs } from 'expo-router';
import {ReactNode} from "react";
import {appBackgroundColorHexDark, appBackgroundColorHexLight} from "@/lib/constants";
import {useColorScheme} from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

export default function AuthorizedLayout(): ReactNode {
    const isDark = useColorScheme() === "dark";

    const backgroundColor = isDark
        ? appBackgroundColorHexDark
        : appBackgroundColorHexLight;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2563eb",

                sceneStyle: {
                    backgroundColor,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <Octicons name={"home"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="statistics"
                options={{
                    title: "statistics",
                    tabBarIcon: ({ color, focused }) => (
                        <Octicons name={"graph"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "profile",
                    tabBarIcon: ({ color, focused }) => (
                        <Octicons name={"person"} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}