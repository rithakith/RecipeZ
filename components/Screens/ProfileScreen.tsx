import React, { useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../navigation/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { userData } = useContext(AuthContext);
  const navigation = useNavigation(); // Hook to navigate between screens

  console.log("userdata", userData);
  console.log("userdata", userData.sub);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Information</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{userData?.preferred_username || "N/A"}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData?.email || "N/A"}</Text>
      </View>

      {/* Button to edit personal details */}
      <TouchableOpacity 
  style={styles.editButton} 
  onPress={() => navigation.navigate("QuestionScreen", { resetToFirstStep: true })} // Pass a parameter
>
  <Text style={styles.editButtonText}>Edit Personal Details</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
    marginVertical: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
  },
  value: {
    fontSize: 18,
    color: "#333",
  },
  editButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#70B9BE", // Button color
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});