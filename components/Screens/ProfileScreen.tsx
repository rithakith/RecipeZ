import React, { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const url = process.env.EXPO_PUBLIC_API_URL;

  // Fetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchStoredData = async () => {
        await retrieveUserData();
      };
      fetchStoredData();
    }, [])
  );

  useEffect(() => {
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
        setUserData(parsedUserData);
      }

      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.log("Error retrieving user data:", error);
    }
  };

  const checkUserExists = async (sub) => {
    try {
      console.log("sub", sub);
      const response = await fetch(`${url}/api/${sub}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json(); // Parse JSON response
        setUser(data); // Set user data
        console.log("User data from API:", data);
        return true;
      } else if (response.status === 404) {
        setUser(null);
        return false;
      } else {
        throw new Error("Error checking user existence");
      }
    } catch (err) {
      console.error("Error checking user existence:", err);
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Information</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{user?.user_name || "N/A"}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || "N/A"}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Allergies:</Text>
        <Text style={styles.value}>
          {Array.isArray(user?.user_allergies)
            ? user.user_allergies.join(", ")
            : "None"}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Dietary Preferences:</Text>
        <Text style={styles.value}>
          {user?.dietary_preferences?.diet_type || "None"}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Health Goals:</Text>
        <Text style={styles.value}>
          {user?.dietary_preferences?.diet_type || "None"}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Current Ingredients:</Text>
        <Text style={styles.value}>
          {user?.current_ingredients?.join(",") || "None"}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Favorited Recipes:</Text>
        <Text style={styles.value}>
          {user?.favorited_recipes?.length > 0
            ? user.favorited_recipes.join(", ")
            : "No favorite recipes"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          navigation.navigate("QuestionScreen", { resetToFirstStep: true })
        }
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
    backgroundColor: "#70B9BE",
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
