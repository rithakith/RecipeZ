import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

type LoginScreenProps = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {/* Add form fields here (e.g., username, password) */}
      <Button title="Log In" onPress={() => navigation.navigate("Home")} />
      <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default LoginScreen;
