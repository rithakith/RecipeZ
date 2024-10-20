import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const url = process.env.EXPO_PUBLIC_API_URL;

const InteractiveBottomSheet: React.FC = () => {
  const [step, setStep] = useState(0);
  const [maxCookTime, setMaxCookTime] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string>("");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [responseRecipes, setResponseRecipes] = useState<string[]>([]); // Store response recipes

  // Step data collection
  const [formData, setFormData] = useState({
    ingredients: [],
    allergies: [],
    max_minutes: 0,
    suggestions: "",
  });

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
    console.log(formData);
  };
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

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
        setUserData(parsedUserData);
      }

      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      // Handle error
    }
  };

  const checkUserExists = async (sub) => {
    try {
      const response = await fetch(`${url}/api/${sub}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json(); // Parse JSON response
        setUser(data); // Set user data
        setFormData((prev) => ({
          ...prev,
          ingredients: data.current_ingredients || [],
          allergies: data.user_allergies || [],
        }));
      } else if (response.status === 404) {
        setUser(null);
      } else {
        throw new Error("Error checking user existence");
      }
    } catch (err) {
      // Handle error
    }
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      max_minutes: parseInt(maxCookTime) || 0, // Update max_minutes
    }));
  }, [maxCookTime]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      suggestions: suggestions, // Update suggestions
    }));
  }, [suggestions]);

  const handleSubmit = async () => {
    console.log("Form Data:", formData);
    try {
      const response = await fetch("http://192.168.1.138:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: formData.ingredients,
          allergies: formData.allergies,
          max_minutes: formData.max_minutes,
          suggestions: formData.suggestions,
        }),
      });
      console.log("Response:", response);

      if (response.ok) {
        const data = await response.json(); // Parse JSON response
        console.log("Recipes:", data.recommended_recipes);
        setResponseRecipes(data.recommended_recipes); // Set response recipes
        nextStep();
      } else {
        const errorText = await response.text(); // Get the error message
        console.error("Error response:", errorText);
        throw new Error("Error fetching recipes");
      }
    } catch (err) {
      // Handle error
      console.error("Error fetching recipes:", err);
    }
  };

  return (
    <BottomSheetView style={styles.container}>
      {/* Step 1 - Display Ingredients */}
      {step === 0 && (
        <View style={styles.stepContainer}>
          <View style={styles.step1Header}>
            <Icon name="rocket" size={30} color="#70B9BE" />
            <Text style={styles.title}>Your Ingredients</Text>
          </View>
          <Text style={styles.subText}>Here are the ingredients you have:</Text>
          <View style={styles.ingredientContainer}>
            {formData.ingredients.length > 0 ? (
              formData.ingredients.map((ingredient, index) => (
                <Text key={index} style={styles.ingredientItem}>
                  {ingredient}
                </Text>
              ))
            ) : (
              <Text style={styles.ingredientItem}>No ingredients found</Text>
            )}
          </View>
          <Button title="Next" onPress={nextStep} />
        </View>
      )}

      {/* Step 2 - Display Allergies */}
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Your Allergies</Text>
          <Text style={styles.subText}>
            Here are the ingredients you are allergic to:
          </Text>
          <View style={styles.ingredientContainer}>
            {formData.allergies.length > 0 ? (
              formData.allergies.map((allergy, index) => (
                <Text key={index} style={styles.ingredientItem}>
                  {allergy}
                </Text>
              ))
            ) : (
              <Text style={styles.ingredientItem}>No allergies found</Text>
            )}
          </View>
          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}

      {/* Step 3 - Enter Maximum Cooking Time and save data */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Maximum Cooking Time</Text>
          <Text style={styles.subText}>
            Enter the maximum time you want to spend cooking (in minutes):
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter time in minutes"
            placeholderTextColor="gray"
            value={maxCookTime}
            onChangeText={setMaxCookTime}
          />

          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}

      {/* Step 4 - Additional Suggestions */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Additional Suggestions</Text>
          <Text style={styles.subText}>
            Any additional preferences for your recipe?
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter any suggestions"
            placeholderTextColor="gray"
            value={suggestions}
            onChangeText={setSuggestions}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit} // Submit the data
          >
            <Text style={styles.submitButtonText}>Get Recipes</Text>
          </TouchableOpacity>

          <Button title="Back" onPress={prevStep} />
        </View>
      )}

      {/* Step 5 - Display Recipes */}
      {step === 4 && (
        <ScrollView style={styles.stepContainerScroll}>
          <Text style={styles.title}>Here are your recipes!</Text>

          {responseRecipes.length > 0 ? (
            responseRecipes.map((recipe, index) => (
              <View key={index} style={styles.recipeContainer}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeDescription}>
                  {recipe.description}
                </Text>

                <Text style={styles.recipeSectionTitle}>Ingredients:</Text>
                {recipe.ingredients.map((ingredient, idx) => (
                  <Text key={idx} style={styles.recipeText}>
                    - {ingredient}
                  </Text>
                ))}

                <Text style={styles.recipeSectionTitle}>Steps:</Text>
                {/* {recipe.steps.map((stepText, idx) => (
                  <Text key={idx} style={styles.recipeText}>
                    {idx + 1}. {stepText}
                  </Text>
                ))} */}

                <Text style={styles.recipeText}>
                  Time: {recipe.minutes} minutes
                </Text>

                <Text style={styles.recipeSectionTitle}>Tags:</Text>
                {/* <Text style={styles.recipeText}>{recipe.tags.join(", ")}</Text> */}
              </View>
            ))
          ) : (
            <Text>No recipes found</Text>
          )}

          <Button title="Finish" onPress={() => setStep(0)} />
        </ScrollView>
      )}
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#F1F5f5",
  },
  stepContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  stepContainerScroll: {
    width: "100%",
  },
  step1Header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  subText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  ingredientContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
  },
  ingredientItem: {
    backgroundColor: "#70b9be",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 5,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#70B9BE",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: "80%",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#042628",
    borderRadius: 10,
    padding: 10,
    width: "80%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
  recipeContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  recipeName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  recipeDescription: { fontSize: 14, marginBottom: 10 },
  recipeSectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  recipeText: { fontSize: 14, marginVertical: 2 },
});

export default InteractiveBottomSheet;
