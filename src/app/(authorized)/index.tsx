import {View, Text, Button} from 'react-native';
import {ReactNode} from "react";
import {useAuthSession} from "@/providers/AuthProvider";

export default function HomeScreen(): ReactNode {
    const {signOut} = useAuthSession();
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>YOU ARE LOGGED IN!</Text>
            <Button title={"Sign out"} onPress={signOut}/>
        </View>
    );
}