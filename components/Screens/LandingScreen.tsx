// components/Screens/LandingScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

type LandingScreenProps = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RecipeZ</Text>
      <Button title="Log In" onPress={() => navigation.navigate("Login")} />
      <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default LandingScreen;
