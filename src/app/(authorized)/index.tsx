import { View, Text } from 'react-native';
import { ReactNode } from "react";

export default function HomeScreen(): ReactNode {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>YOU ARE LOGGED IN!</Text>
        </View>
    );
}