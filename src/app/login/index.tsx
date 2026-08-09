import {ReactNode} from "react";
import {useAuthSession} from "@/providers/AuthProvider";
import {View, Button, Text} from "react-native";
import {router} from "expo-router";

export default function Login(): ReactNode {
    const {loginUser} = useAuthSession();
    const login = async (): Promise<void> => {
        const result = await loginUser('honeybun@gmail.com', 'honeybun');

        if (result.success) {
            console.log("Login successful:", result.data);
            router.replace('/(authorized)');
        } else {
            console.error("Login failed:", result.error);
        }
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Login screen</Text>
            <Button title={"Login"} onPress={login} />
        </View>
    );
}