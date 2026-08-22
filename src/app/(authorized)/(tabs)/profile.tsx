import React, {useEffect, useState} from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
    ScrollView,
} from "react-native";
import {
    Feather,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useAuthSession} from "@/providers/AuthProvider";
import {User} from "@supabase/supabase-js";

type ProfileMenuItem = {
    label: string;
    icon: React.ReactNode;
};

const menuItems: ProfileMenuItem[] = [
    {
        label: "Account Details",
        icon: <Feather name="user" size={22} color="#5E626D" />,
    },
    {
        label: "Password & Security",
        icon: <Feather name="lock" size={22} color="#5E626D" />,
    },
    {
        label: "Connected Health Apps",
        icon: (
            <MaterialCommunityIcons
                name="pulse"
                size={24}
                color="#5E626D"
            />
        ),
    },
    {
        label: "Form Analytics Settings",
        icon: <Feather name="sliders" size={22} color="#5E626D" />,
    },
    {
        label: "Notification Preferences",
        icon: <Feather name="bell" size={22} color="#5E626D" />,
    },
    {
        label: "Help & Support",
        icon: (
            <Feather name="help-circle" size={22} color="#5E626D" />
        ),
    },
];

export default function ProfileScreen() {
    const { session } = useAuthSession();

    function handleMenuPress(label: string) {
        // Replace this with your navigation logic.
        Alert.alert(label, `${label} screen coming soon.`);
    }

    function handleLogout() {
        Alert.alert(
            "Log out?",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        // Add Supabase sign-out logic here:
                    },
                },
            ]
        );
    }

    return (
        <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.screen}>
                <Text style={styles.title}>My Profile</Text>

                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Ionicons
                            name="person"
                            size={45}
                            color="#0000FF"
                        />
                    </View>

                    <View style={styles.profileInformation}>
                        <Text style={styles.userName}>{session?.user.user_metadata.display_name}</Text>
                        <Text style={styles.email}>{session?.user.email}</Text>
                        <Text style={styles.memberSince}>
                            Member since 2026
                        </Text>
                    </View>
                </View>

                <View style={styles.menu}>
                    {menuItems.map((item, index) => (
                        <Pressable
                            key={item.label}
                            accessibilityRole="button"
                            style={({ pressed }) => [
                                styles.menuItem,
                                index !== menuItems.length - 1 &&
                                styles.menuItemBorder,
                                pressed && styles.menuItemPressed,
                            ]}
                            onPress={() => handleMenuPress(item.label)}
                        >
                            <View style={styles.menuItemContent}>
                                <View style={styles.menuIcon}>{item.icon}</View>

                                <Text style={styles.menuLabel}>
                                    {item.label}
                                </Text>
                            </View>

                            <Feather
                                name="chevron-right"
                                size={22}
                                color="#A2A5AD"
                            />
                        </Pressable>
                    ))}
                </View>

                <Pressable
                    accessibilityRole="button"
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.logoutButtonPressed,
                    ]}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>Log Out</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FAF9F7",
    },

    screen: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 42,
    },

    title: {
        marginBottom: 24,
        color: "#17181C",
        fontSize: 27,
        fontWeight: "700",
        letterSpacing: -0.5,
    },

    profileCard: {
        minHeight: 124,
        paddingHorizontal: 20,
        paddingVertical: 18,
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D8E1EB",
        borderRadius: 26,
    },

    avatar: {
        width: 82,
        height: 82,
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#B8B8FF",
        borderWidth: 2,
        borderColor: "#0000FF",
        borderRadius: 41,
    },

    profileInformation: {
        flex: 1,
        marginLeft: 20,
    },

    userName: {
        marginBottom: 4,
        color: "#202126",
        fontSize: 20,
        fontWeight: "700",
    },

    email: {
        marginBottom: 4,
        color: "#606570",
        fontSize: 14,
    },

    memberSince: {
        color: "#A0A4AD",
        fontSize: 14,
    },

    menu: {
        marginTop: 26,
        overflow: "hidden",

        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D8E1EB",
        borderRadius: 26,
    },

    menuItem: {
        minHeight: 58,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    menuItemBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#D8E1EB",
    },

    menuItemPressed: {
        backgroundColor: "#F5F7F9",
    },

    menuItemContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },

    menuIcon: {
        width: 34,
        alignItems: "flex-start",
    },

    menuLabel: {
        flex: 1,
        color: "#282A30",
        fontSize: 16,
        fontWeight: "400",
    },

    logoutButton: {
        height: 62,
        marginTop: 26,
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#FFE0E0",
        borderRadius: 21,
    },

    logoutButtonPressed: {
        backgroundColor: "#FFD1D1",
        transform: [{ scale: 0.99 }],
    },

    logoutText: {
        color: "#FF4646",
        fontSize: 17,
        fontWeight: "700",
    },
});