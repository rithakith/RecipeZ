import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../navigation/AuthContext";
import { Linking } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// Enable WebBrowser for authentication sessions
WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = "SgfaNj1qXJGFCaIOkmdhj020Zmsa";
const url = process.env.EXPO_PUBLIC_API_URL;

export default function Auth() {
  const navigation = useNavigation();
  const discovery = AuthSession.useAutoDiscovery(
    "https://api.asgardeo.io/t/org606kb/oauth2/token"
  );
  const [tokenResponse, setTokenResponse] = useState({});
  const [decodedIdToken, setDecodedIdToken] = useState({});

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "com.ritzy0717.recipez",
    path: "oauth2",
  });

  // console.log("Discovery:", discovery);
  // console.log("redirectUri:", redirectUri);

  const storeUserData = async (userData, token) => {
    try {
      console.log("Storing user data and token:", userData, token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      await AsyncStorage.setItem("authToken", token);
      console.log("User data and token saved successfully");
    } catch (error) {
      console.log("Error saving user data:", error);
    }
  };

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: CLIENT_ID,
      responseType: "code",
      scopes: ["openid", "profile", "email"],
    },
    discovery
  );

  console.log("Request object:", request);
  console.log("Result object:", result);

  useEffect(() => {
    const handleDeepLink = (event) => {
      const { url } = event;
      console.log("Deep link triggered, URL:", url);
      const params = new URL(url).searchParams;
      const code = params.get("code");
      console.log("Authorization code:", code);
      if (code) {
        getAccessToken(code);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    console.log("Deep link subscription added");

    return () => {
      console.log("Removing deep link subscription");
      subscription.remove();
    };
  }, []);

  const checkUserExists = async (sub) => {
    console.log("Checking if user exists with sub:", sub);
    try {
      const response = await fetch(`${url}/api/${sub}`, {
        method: "GET",
      });
      console.log("User existence check response:", response);
      return response.ok;
    } catch (err) {
      console.error("Error checking user existence:", err);
      return false;
    }
  };

  const sendUserData = async (userData) => {
    console.log("Sending user data:", userData);
    const userExists = await checkUserExists(userData.sub);
    console.log("User exists:", userExists);

    if (!userExists) {
      try {
        const response = await fetch(`${url}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sub: userData.sub,
            user_name: userData.preferred_username,
            email: userData.email,
            user_allergies: {},
            dietary_preferences: {},
            health_goals: {},
            current_ingredients: {},
            favorited_recipes: {},
          }),
        });
        console.log("Send user data response:", response);

        if (!response.ok) {
          throw new Error("Failed to send user data");
        }

        console.log("User data sent successfully");
      } catch (err) {
        console.error("Error sending user data:", err);
      }
    } else {
      console.log("User already exists. No action taken.");
    }
  };

  const getAccessToken = async (code) => {
    console.log("Getting access token with code:", code);
    if (result?.params?.code) {
      try {
        const response = await fetch(
          "https://api.asgardeo.io/t/org606kb/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=authorization_code&code=${result.params.code}&redirect_uri=${redirectUri}&client_id=${CLIENT_ID}&code_verifier=${request?.codeVerifier}`,
          }
        );
        const data = await response.json();
        console.log("Token response data:", data);

        setTokenResponse(data);
        const decoded = jwtDecode(data.id_token);
        console.log("Decoded ID token:", decoded);

        setDecodedIdToken(decoded);
        await storeUserData(decoded, data.id_token);
        await sendUserData(decoded);
        console.log("Navigating to DetailInquiry");
        navigation.navigate("DetailInquiry");
      } catch (err) {
        console.log("Error fetching access token:", err);
      }
    }
  };

  const checkForToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Checking for stored token:", token);
      if (token) {
        const decodedToken = jwtDecode(token);

        // Check if token has expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          console.log("Token is still valid, navigating to DetailInquiry");
          setDecodedIdToken(decodedToken);
          navigation.navigate("DetailInquiry");
        } else {
          console.log("Token has expired, user needs to log in");
          // If token expired, you might want to remove it and prompt the user to log in
          await AsyncStorage.removeItem("authToken");
        }
      }
    } catch (err) {
      console.log("Error checking for token:", err);
    }
  };

  const handleLogout = async () => {
    const idTokenHint = tokenResponse.id_token;
    const state = "some_state_value";

    try {
      console.log("Logging out with id_token_hint:", idTokenHint);
      const response = await fetch(
        "https://api.asgardeo.io/t/org606kb/oidc/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `client_id=${CLIENT_ID}&id_token_hint=${idTokenHint}&post_logout_redirect_uri=${redirectUri}&state=${state}`,
        }
      );

      console.log("Logout response:", response);

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      await AsyncStorage.removeItem("authToken");
      setTokenResponse({});
      setDecodedIdToken({});
      Alert.alert("Logout successful!");
    } catch (err) {
      console.log("Logout error:", err);
      Alert.alert("Logout error", err.message);
    }
  };

  useEffect(() => {
    checkForToken();
  }, []);

  useEffect(() => {
    if (result?.type === "success" && result.params?.code) {
      console.log("Result success, getting access token");
      getAccessToken(result.params.code);
    }
  }, [result]);

  return (
    <ImageBackground
      source={require("../../assets/images/LandingBG.png")}
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
            onPress={() => {
              console.log("Login button pressed, prompting async");
              promptAsync();
            }}
            disabled={!request}
          >
            <Text style={styles.buttonText}>Log In</Text>
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
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    paddingBottom: 40,
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
    marginVertical: 5,
  },
  loginButton: {
    backgroundColor: "#042628",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
