import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation(); // Hook to navigate between screens

  // Dummy data
  const user = {
    username: "Akith Chandinu",
    email: "akith.chandinu@gmail.com",
    image: "https://via.placeholder.com/150", // Placeholder image
    allergies: ["Peanuts", "Shellfish"],
    healthGoals: ["Weight Loss", "Improve Strength"],
    dietaryPreferences: ["Vegetarian", "Low Carb"],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Information</Text>

      {/* Profile Image */}
      <Image source={{ uri: user.image }} style={styles.profileImage} />

      {/* Personal Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{user.username}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      {/* Allergies */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Allergies:</Text>
        <Text style={styles.value}>{user.allergies.join(", ")}</Text>
      </View>

      {/* Health Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Goals:</Text>
        <Text style={styles.value}>{user.healthGoals.join(", ")}</Text>
      </View>

      {/* Dietary Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dietary Preferences:</Text>
        <Text style={styles.value}>{user.dietaryPreferences.join(", ")}</Text>
      </View>

      {/* Button to edit personal details */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("DetailInquiry")} // Pass a parameter
      >
        <Text style={styles.editButtonText}>Edit Personal Details</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
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
  section: {
    marginVertical: 10,
    width: "100%",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
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

export default ProfileScreen;
