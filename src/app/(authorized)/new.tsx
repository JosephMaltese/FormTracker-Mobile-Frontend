import { View, Text  } from "react-native";
import { ReactNode } from "react";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

export default function NewScreen(): ReactNode {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text>New</Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}