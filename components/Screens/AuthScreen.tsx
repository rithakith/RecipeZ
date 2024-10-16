import { useState, useEffect,useContext } from "react";
import { StyleSheet, Text, View, Alert, ImageBackground, TouchableOpacity } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../navigation/AuthContext";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri();
const CLIENT_ID = "SgfaNj1qXJGFCaIOkmdhj020Zmsa";
const url = process.env.EXPO_PUBLIC_API_URL;
export default function Auth({ navigation }) {
  const { saveToken ,saveUserData} = useContext(AuthContext); // Get saveToken from AuthContext

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
  const checkUserExists = async (sub) => {
    try {
      const response = await fetch(`${url}/api/${sub}`, {
        method: 'GET',
      });
  
      if (response.ok) {
        // User exists
        return true;
      } else if (response.status === 404) {
        // User does not exist
        return false;
      } else {
        throw new Error('Error checking user existence');
      }
    } catch (err) {
      console.error('Error checking user existence:', err);
      return false; // Consider user does not exist in case of error
    }
  };

  const sendUserData = async (userData) => {
    const userExists = await checkUserExists(userData.sub);
  
    if (!userExists) {
      try {
        const response = await fetch(`${url}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sub: userData.sub,
            user_name: userData.preferred_username,
            email: userData.email,
            user_allergies: {}, // Default values
            dietary_preferences: {},
            health_goals: {},
            current_ingredients: {},
            favorited_recipes: {},
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to send user data');
        }
  
        console.log('User data sent successfully');
      } catch (err) {
        console.error('Error sending user data:', err);
      }
    } else {
      console.log('User already exists. No action taken.');
    }
  };
  

  const getAccessToken = async () => {
    if (result?.params?.code) {
      fetch("https://api.asgardeo.io/t/org606kb/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=authorization_code&code=${result?.params?.code}&redirect_uri=${redirectUri}&client_id=${CLIENT_ID}&code_verifier=${request?.codeVerifier}`,
      })
        .then((response) => response.json())
        .then(async (data) => {
          setTokenResponse(data);
          const decoded = jwtDecode(data.id_token);
          setDecodedIdToken(decoded);

          // Use saveToken from context to save the token
          saveToken(data.id_token);
          saveUserData(decoded);
          await sendUserData(decoded); 
          navigation.navigate("DetailInquiry");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const checkForToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        setDecodedIdToken(jwtDecode(token));
        console.log("token",decodedIdToken);
        navigation.navigate("DetailInquiry"); // Skip login if token exists
      }
    } catch (err) {
      console.log("Error checking for token:", err);
    }
  };

  const handleLogout = async () => {
    const idTokenHint = tokenResponse.id_token;
    const state = "some_state_value";

    fetch("https://api.asgardeo.io/t/org606kb/oidc/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_id=${CLIENT_ID}&id_token_hint=${idTokenHint}&post_logout_redirect_uri=${redirectUri}&state=${state}`,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Logout failed");
        }
        await AsyncStorage.removeItem("authToken"); // Clear the token
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
    checkForToken(); // Check for token on component mount
  }, []);

  useEffect(() => {
    if (result) {
      if (result.error) {
        Alert.alert("Authentication error", result.params.error_description || "something went wrong");
        return;
      }
      if (result.type === "success") {
        getAccessToken();
      }
    }
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
          {/* <TouchableOpacity
            style={[styles.button, styles.signUpButton]}
            onPress={() => navigation.navigate("DetailInquiry")}
          >
            <Text style={styles.buttonText}>Create New Account</Text>
          </TouchableOpacity> */}
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
