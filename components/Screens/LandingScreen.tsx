import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

type LandingScreenProps = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
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
};

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

export default LandingScreen;
