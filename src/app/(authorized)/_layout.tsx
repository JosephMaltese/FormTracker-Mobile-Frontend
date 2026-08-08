import { Tabs } from 'expo-router';
import {ReactNode} from "react";

export default function AuthorizedLayout(): ReactNode {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2563eb",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                }}
            />
            <Tabs.Screen
                name="statistics"
                options={{
                    title: "statistics",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "profile",
                }}
            />

        </Tabs>
    );
}