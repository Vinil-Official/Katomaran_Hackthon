import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import auth from "../Service/FireAuth"; // ✅ Firebase Auth instance

WebBrowser.maybeCompleteAuthSession();

export default function LoginForm({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorField, setErrorField] = useState(null);
  const [shakeAnim] = useState(new Animated.Value(0));

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "909233606464-ol91tn27ec4id2r7v1p3iceu89tks3d4.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("✅ Google Sign-In success:", userCredential.user.email);
          navigation.navigate("JournalPage");
        })
        .catch((error) => {
          console.error("❌ Google Sign-In error:", error.message);
        });
    }
  }, [response]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 70, useNativeDriver: true }),
    ]).start();
  };

  const HandleLogin = () => {
    if (!email || !password) {
      setErrorField(!email ? "email" : "password");
      triggerShake();
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("✅ Logged in:", userCredential.user.email);
        setErrorField(null);
        navigation.navigate("JournalPage");
      })
      .catch((error) => {
        console.error("❌ Login error:", error.code, error.message);
        setErrorField("password");
        triggerShake();
      });
  };

  const goToregister = () => {
    navigation.navigate("Register");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1200&q=80",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Continue your beautiful memories 🌸</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errorField === "email" && styles.inputError]}
            placeholder="Enter your Email"
            placeholderTextColor="rgba(0,0,0,0.5)"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errorField === "email") setErrorField(null);
            }}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errorField === "password" && styles.inputError]}
            placeholder="Enter your Password"
            placeholderTextColor="rgba(0,0,0,0.5)"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorField === "password") setErrorField(null);
            }}
            secureTextEntry
          />

          <TouchableOpacity style={styles.buttonSubmit} onPress={HandleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* ✅ Added Google Sign-In Button */}
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
            Don’t have an account?{" "}
            <Text onPress={goToregister} style={styles.linkText}>
              Sign Up
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
  inputError: {
    borderColor: "#ff6b6b",
    backgroundColor: "rgba(255, 230, 230, 0.9)",
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
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleText: {
    fontWeight: "600",
    fontSize: 15,
  },
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
