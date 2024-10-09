import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

type SignUpScreenProps = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {/* Add form fields here (e.g., username, password, etc.) */}
      <Button title="Sign Up" onPress={() => navigation.navigate("Home")} />
      <Button
        title="Already have an account? Log In"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default SignUpScreen;
