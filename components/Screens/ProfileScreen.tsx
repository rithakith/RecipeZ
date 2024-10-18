import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const navigation = useNavigation(); // Hook to navigate between screens
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const url = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    // Retrieve stored user data and token on component mount
    const fetchStoredData = async () => {
      await retrieveUserData();
    };
    fetchStoredData();
  }, []);

  useEffect(() => {
    // Check if the user exists when the userData is available
    if (userData && userData.sub) {
      checkUserExists(userData.sub);
    }
  }, [userData]);

  const retrieveUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      const storedToken = await AsyncStorage.getItem("authToken");

      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        console.log("User Data:", parsedUserData);
        setUserData(parsedUserData); // Set user data in state
      }

      if (storedToken) {
        setToken(storedToken); // Set token in state
      }
    } catch (error) {
      console.log("Error retrieving user data:", error);
    }
  };

  const checkUserExists = async (sub) => {
    try {
      console.log("sub", sub);
      const response = await fetch(`${url}/api/${sub}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json(); // Parse JSON response
        setUser(data); // Set user data
        return true;
      } else if (response.status === 404) {
        // User does not exist
        setUser(null); // Clear user state if not found
        return false;
      } else {
        throw new Error('Error checking user existence');
      }
    } catch (err) {
      console.error('Error checking user existence:', err);
      return false; // Consider user does not exist in case of error
    }
  };

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
