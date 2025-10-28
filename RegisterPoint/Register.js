import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import auth from "../Service/FireAuth";

WebBrowser.maybeCompleteAuthSession();

export default function RegisterForm({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shakeAnim] = useState(new Animated.Value(0));

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "909233606464-ol91tn27ec4id2r7v1p3iceu89tks3d4.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("✅ Google Sign-In success:", userCredential.user.email);
          Alert.alert("Success", "Signed in with Google!");
        })
        .catch((error) => {
          console.error("❌ Google Sign-In error:", error.message);
          Alert.alert("Error", error.message);
        });
    }
  }, [response]);

  const handleRegister = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("✅ Registered:", userCredential.user.email);
        Alert.alert("Success", "Account created!");
      })
      .catch((error) => {
        console.error("❌ Register error:", error.message);
        Alert.alert("Error", error.message);
      });
  };
  const goToseeLogin=()=>{
     navigation.navigate('Login')
  }

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View
          style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}
        >
          <Text style={styles.title}>Create a New Memory</Text>
          <Text style={styles.subtitle}>
            Begin your beautiful journey today 🌸
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Email"
            placeholderTextColor="rgba(0,0,0,0.5)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Password"
            placeholderTextColor="rgba(0,0,0,0.5)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.buttonSubmit} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>OR</Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png",
              }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text onPress={goToseeLogin} style={styles.linkText}>
              Sign In
            </Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  form: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    borderRadius: 25,
    paddingVertical: 35,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#222",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "#444",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 25,
  },
  label: {
    color: "#333",
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 15,
  },
  input: {
    borderWidth: 1.2,
    borderColor: "rgba(0,0,0,0.3)",
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#222",
    backgroundColor: "rgba(255,255,255,0.95)",
    marginBottom: 18,
  },
  buttonSubmit: {
    backgroundColor: "#ff8fab",
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#ff8fab",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
  orText: {
    textAlign: "center",
    color: "#333",
    fontSize: 14,
    marginVertical: 15,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    paddingVertical: 10,
  },
  googleIcon: { width: 24, height: 24, marginRight: 10 },
  googleText: { fontWeight: "600", fontSize: 15 },
  footerText: {
    textAlign: "center",
    color: "#333",
    fontSize: 14,
    marginTop: 18,
  },
  linkText: {
    color: "#d63384",
    fontWeight: "600",
  },
});
