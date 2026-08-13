import { View, Text, StyleSheet } from 'react-native';
import {ReactNode, useEffect, useMemo, useState} from "react";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useAuthSession} from "@/providers/AuthProvider";
import {User} from "@supabase/supabase-js";
import Octicons from '@expo/vector-icons/Octicons';
import MuscleDiagram from "@/components/muscleDiagram";
import ProgressChart from "@/components/ProgressChart";
import { ExtendedBodyPart } from "react-native-body-highlighter";

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
                <ProgressChart
                    exerciseName={"Chest Press"}
                    average={75}
                    data={[
                        {value: 50, label: 'Mon'},
                        {value: 70, label: 'Tues'},
                        {value: 77, label: 'Wed'},
                        {value: 75, label: 'Thurs'},
                        {value: 82, label: 'Fri'},
                        {value: 83, label: 'Sat'}
                    ]}
                />
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
        marginTop: 15,
        justifyContent: "space-between",
    },
    heroPrimaryText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    heroSecondaryText: {
        fontSize: 15,
        fontWeight: "light",
    },
    bellIcon: {
        margin: "auto",
        borderColor: "grey",
        borderStyle: "solid",
        padding: 4,
        borderWidth: 1.5,
        borderRadius: 10,
        backgroundColor: "white",
    }
});