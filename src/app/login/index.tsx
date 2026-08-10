import {ReactNode, useState} from "react";
import {useAuthSession} from "@/providers/AuthProvider";
import { Button, Text, TextInput } from "react-native";
import {router} from "expo-router";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
var validator = require('validator');

export default function Login(): ReactNode {
    const {loginUser} = useAuthSession();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const disableLoginButton = () => {
        return email.length === 0 || password.length === 0;
    }

    const passwordChangeHandler = (value: string) => {
        const strippedValue = validator.trim(value);
        setPassword(strippedValue);
    }

    const login = async (): Promise<void> => {
        const strippedEmail = validator.normalizeEmail(email);
        const result = await loginUser(strippedEmail, password);

        if (result.success) {
            console.log("Login successful:", result.data);
            router.replace('/(authorized)');
        } else {
            console.error("Login failed:", result.error);
        }
    }

    return (
        <SafeAreaProvider
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <SafeAreaView>
                <Text>Login</Text>
                <TextInput
                    onChangeText={setEmail}
                    value={email}
                    placeholder={"Email"}
                    autoCapitalize={"none"}
                />
                <TextInput
                    onChangeText={passwordChangeHandler}
                    value={password}
                    placeholder={"Password"}
                    autoCapitalize={"none"}
                />
                <Button title={"Login"} onPress={login} disabled={disableLoginButton()} />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}