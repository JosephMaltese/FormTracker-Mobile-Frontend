import {View, Text, Button} from 'react-native';
import {ReactNode} from "react";
import {useAuthSession} from "@/providers/AuthProvider";

export default function ProfileScreen(): ReactNode {
    const {signOut} = useAuthSession();
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>Profile</Text>
            <Button title={"Sign out"} onPress={signOut}/>
        </View>
    );
}