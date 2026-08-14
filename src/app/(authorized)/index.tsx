import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {ReactNode, useEffect, useState} from "react";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useAuthSession} from "@/providers/AuthProvider";
import {User} from "@supabase/supabase-js";
import Octicons from '@expo/vector-icons/Octicons';
import MuscleDiagram from "@/components/muscleDiagram";
import { ExtendedBodyPart } from "react-native-body-highlighter";
import ProgressCharts from "@/components/ProgressCharts";

export default function HomeScreen(): ReactNode {
    const { getUser } = useAuthSession();
    const [user, setUser] = useState<User | null>(null);
    const frontMusclesTrained = [
        {
            slug: "chest" as const,
            side: "left" as const,
            intensity: 1,
        },
        {
            slug: "biceps" as const,
            intensity: 2,
        },
        {
            slug: "abs" as const,
            intensity: 3,
        },
    ] as ExtendedBodyPart[];

    const backMusclesTrained = [
        {
            slug: "upper-back" as const,
            intensity: 2,
        },
    ] as ExtendedBodyPart[];

    useEffect(() => {
        const populateUserData = async () => {
            try {
                const response = await getUser();
                setUser(response);
                console.log("USER OBTAINED:", response);
            } catch (err) {
                console.error(err);
            }
        };

        populateUserData();
    }, []);
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.page}>
                <ScrollView>
                    <View style={styles.heroContainer}>
                        <View>
                            {user !== null ?
                                <Text style={styles.heroPrimaryText}>Hey, {user.user_metadata.display_name}!</Text>
                                : <Text style={styles.heroPrimaryText}>Welcome back!</Text>
                            }
                            <Text style={styles.heroSecondaryText}>Ready to perfect your form today?</Text>
                        </View>
                        <Octicons name="bell" size={24} color="black" style={styles.bellIcon}/>

                    </View>
                    <MuscleDiagram frontMusclesTrained={frontMusclesTrained} backMusclesTrained={backMusclesTrained} />
                    <ProgressCharts />
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    page: {
        marginHorizontal: "5%",
    },
    heroContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "space-between",
        marginBottom: 20,
    },
    heroPrimaryText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    heroSecondaryText: {
        fontSize: 15,
        fontWeight: "light",
        marginTop: 5,
    },
    bellIcon: {
        marginVertical: "auto",
        borderColor: "grey",
        borderStyle: "solid",
        padding: 4,
        borderWidth: 1.5,
        borderRadius: 10,
        backgroundColor: "white",
    }
});