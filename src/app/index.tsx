import {View, Text, Button} from 'react-native';
import {router} from 'expo-router';
import {ReactNode} from "react";

export default function LandingScreen(): ReactNode {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>FORMTRACKER</Text>
      <Button title={"Login"} onPress={() => router.push('/login')} />
      <Button title={"Sign Up"} onPress={() => router.push('/signup')} />
    </View>
  );
}
