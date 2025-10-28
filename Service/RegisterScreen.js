// RegisterScreen.js
import { Button, View } from "react-native";
import useGoogleAuth from "./useGoogleAuth";

export default function RegisterScreen() {
  const { request, promptAsync } = useGoogleAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Sign in with Google"
        disabled={!request}
        onPress={() => promptAsync()}
      />
    </View>
  );
}
