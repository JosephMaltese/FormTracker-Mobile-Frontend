import {ReactNode, useState} from "react";
import {useAuthSession} from "@/providers/AuthProvider";
import {Button, Text, TextInput} from "react-native";
import {router} from "expo-router";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
var validator = require('validator');

export default function Signup(): ReactNode {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPasswordMatchError, setShowPasswordMatchError] = useState(false);
    const [showStrongPasswordError, setShowStrongPasswordError] = useState(false);
    const {signUpNewUser} = useAuthSession();
    const validPasswordOptions = { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 };

    const confirmPasswordChangeHandler = (value: string) => {
        const strippedValue = validator.trim(value);
        setConfirmPassword(strippedValue);
        if (strippedValue !== password) {
            setShowPasswordMatchError(true);
        } else {
            setShowPasswordMatchError(false);
        }
    }

    const passwordChangeHandler = (value: string) => {
        const strippedValue = validator.trim(value);
        setPassword(strippedValue);
        if (!validator.isStrongPassword(strippedValue, validPasswordOptions)) {
            setShowStrongPasswordError(true);
        } else {
            setShowStrongPasswordError(false);
        }
    }

    const signup = async (): Promise<void> => {
        const strippedUsername = validator.trim(username);
        const strippedEmail = validator.normalizeEmail(email);
        const result = await signUpNewUser(strippedEmail, password, strippedUsername);

        if (result.success) {
            console.log("Signup successful:", result.data);
            router.replace('/(authorized)');
        } else {
            console.error("Signup failed:", result.error);
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
                <Text>Signup</Text>
                <TextInput
                    onChangeText={setUsername}
                    value={username}
                    placeholder={"Your name"}
                />
                <TextInput
                    onChangeText={setEmail}
                    value={email}
                    placeholder={"Your Email"}
                />
                <TextInput
                    onChangeText={passwordChangeHandler}
                    value={password}
                    placeholder={"Password"}
                />
                {showStrongPasswordError && <Text>Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character</Text>}
                <TextInput
                    onChangeText={confirmPasswordChangeHandler}
                    value={confirmPassword}
                    placeholder={"Confirm password"}
                />
                {showPasswordMatchError && <Text>Passwords do not match</Text>}
                <Button title={"Confirm"} onPress={signup} disabled={!!showStrongPasswordError || !!showPasswordMatchError} />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}