import {View, Text} from 'react-native';
import {ReactNode} from "react";

export default function ActivityScreen(): ReactNode {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>Activity</Text>
        </View>
    );
}