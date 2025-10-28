// useGoogleAuth.js
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "./FireAuth";

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "333567193071-bbnfmga29aonqivttng57dediqi4j8dn.apps.googleusercontent.com",
    webClientId: "909233606464-ol91tn27ec4id2r7v1p3iceu89tks3d4.apps.googleusercontent.com", // From Firebase
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => console.log("✅ Google Sign-In Successful"))
        .catch((err) => console.error("❌ Firebase Sign-In Error:", err));
    }
  }, [response]);

  return { request, promptAsync };
}
