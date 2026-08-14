import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {ReactNode, useEffect, useState} from "react";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useAuthSession} from "@/providers/AuthProvider";
import {User} from "@supabase/supabase-js";
import Octicons from '@expo/vector-icons/Octicons';
import MuscleDiagram from "@/components/muscleDiagram";
import { ExtendedBodyPart } from "react-native-body-highlighter";
import ProgressCharts from "@/components/ProgressCharts";
import supabase from "@/lib/subabaseClient";

interface ScoreDataPoint {
    uploaded_at: string,
    score: number,
    exercise_type: string,
}

export default function HomeScreen(): ReactNode {
    const { getUser } = useAuthSession();
    const [user, setUser] = useState<User | null>(null);
    const [sevenDaysData, setSevenDaysData] = useState<ScoreDataPoint[]>([]);
    const [thirtyDaysData, setThirtyDaysData] = useState<ScoreDataPoint[]>([]);
    const [yearData, setYearData] = useState<ScoreDataPoint[]>([]);

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
        // Combined loader so we can await getting the user before querying history.
        const loadUserAndHistory = async () => {
            try {
                const response = await getUser();
                setUser(response);
                console.log("USER OBTAINED:", response);

                // If we don't have a user id, bail early.
                if (!response?.id) return;

                const currentDate = new Date();
                const sevenDaysPrior = new Date();
                const thirtyDaysPrior = new Date();
                const yearPrior = new Date();
                sevenDaysPrior.setDate(currentDate.getDate() - 7);
                thirtyDaysPrior.setDate(currentDate.getDate() - 30);
                // Use setFullYear for subtracting a year (setDate was incorrect here)
                yearPrior.setFullYear(currentDate.getFullYear() - 1);

                // Helper to fetch a range and return the data
                const fetchRange = async (gteIso: string) => {
                    try {
                        const { data, error } = await supabase
                            .from('videos')
                            .select('uploaded_at, score, exercise_type');
                            // .eq('user_id', response.id);
                            // .gte('uploaded_at', gteIso);
                        if (error) {
                            console.error(error);
                            return null;
                        }
                        return data as ScoreDataPoint[] | null;
                    } catch (err) {
                        console.error(err);
                        return null;
                    }
                };

                const sevenData = await fetchRange(sevenDaysPrior.toISOString());
                if (sevenData) setSevenDaysData(sevenData);

                const thirtyData = await fetchRange(thirtyDaysPrior.toISOString());
                if (thirtyData) setThirtyDaysData(thirtyData);

                const yearDataResponse = await fetchRange(yearPrior.toISOString());
                if (yearDataResponse) {
                    setYearData(yearDataResponse);
                    console.log('Successfully fetched data from the past year', yearDataResponse);
                }

            } catch (err) {
                console.error(err);
            }
        };

        loadUserAndHistory();
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