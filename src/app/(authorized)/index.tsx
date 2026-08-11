import { View, Text, StyleSheet } from 'react-native';
import {ReactNode, useEffect, useState} from "react";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useAuthSession} from "@/providers/AuthProvider";
import {User} from "@supabase/supabase-js";
import Octicons from '@expo/vector-icons/Octicons';
import MuscleDiagram from "@/components/muscleDiagram";
import ProgressCharts from "@/components/ProgressCharts";

export default function HomeScreen(): ReactNode {
    const { getUser } = useAuthSession();
    const [user, setUser] = useState<User | null>(null);

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
                <MuscleDiagram />
                <ProgressCharts />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    page: {
        marginHorizontal: "10%",
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