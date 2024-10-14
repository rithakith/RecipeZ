import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert, ImageBackground, TouchableOpacity } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri();

const CLIENT_ID = "SgfaNj1qXJGFCaIOkmdhj020Zmsa";

export default function Auth({ navigation }) {
  const discovery = AuthSession.useAutoDiscovery("https://api.asgardeo.io/t/org606kb/oauth2/token");
  const [tokenResponse, setTokenResponse] = useState({});
  const [decodedIdToken, setDecodedIdToken] = useState({});

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: CLIENT_ID,
      responseType: "code",
      scopes: ["openid", "profile", "email"],
    },
    discovery
  );

  const getAccessToken = () => {
    if (result?.params?.code) {
      fetch("https://api.asgardeo.io/t/org606kb/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=authorization_code&code=${result?.params?.code}&redirect_uri=${redirectUri}&client_id=${CLIENT_ID}&code_verifier=${request?.codeVerifier}`,
      })
        .then((response) => response.json())
        .then((data) => {
          setTokenResponse(data);
          setDecodedIdToken(jwtDecode(data.id_token));
          console.log("Token response", data);
          
          // Navigate to DetailInquiry page upon successful login
          navigation.navigate("DetailInquiry");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleLogout = () => {
    const idTokenHint = tokenResponse.id_token; // Use the ID token returned during login
    const state = "some_state_value"; // Optional: Use any state you want to maintain, e.g., a UUID or session identifier
  
    fetch("https://api.asgardeo.io/t/org606kb/oidc/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_id=${CLIENT_ID}&id_token_hint=${idTokenHint}&post_logout_redirect_uri=${redirectUri}&state=${state}`,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Logout failed");
        }
        // Clear the state on successful logout
        setTokenResponse({});
        setDecodedIdToken({});
        Alert.alert("Logout successful!");
      })
      .catch((err) => {
        console.log("Logout error:", err);
        Alert.alert("Logout error", err.message);
      });
  };

  useEffect(() => {
    (async function setResult() {
      if (result) {
        if (result.error) {
          Alert.alert("Authentication error", result.params.error_description || "something went wrong");
          return;
        }
        if (result.type === "success") {
          getAccessToken();
          console.log(decodedIdToken);
        }
      }
    })();
  }, [result]);

  return (
    <ImageBackground
      source={require("../../assets/images/LandingBG.png")} // Provide the correct path to your image
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.bottomContent}>
          <Text style={styles.title}>
            Help your path to health goals with happiness
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => promptAsync()} disabled={!request}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.signUpButton]}
            onPress={() => navigation.navigate("DetailInquiry")}
          >
            <Text style={styles.buttonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </View>
     
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end", // Aligns content to the bottom
    alignItems: "center",
    width: "100%",
    paddingBottom: 40, // Adds padding from the bottom
  },
  bottomContent: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 20,
    marginHorizontal: 5,
    paddingHorizontal: 1,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginVertical: 5, // Adds space between buttons
  },
  loginButton: {
    backgroundColor: "#042628",
  },
  signUpButton: {
    backgroundColor: "#25A7B0",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

});
