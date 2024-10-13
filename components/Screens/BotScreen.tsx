// BotScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BotScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bot Screen</Text>
      <Text>This is the bot screen where you can interact with the bot.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default BotScreen;
