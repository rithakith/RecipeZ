import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons

const InteractiveBottomSheet: React.FC = () => {
  const [step, setStep] = useState(0);
  const [maxCookTime, setMaxCookTime] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string>("");

  const dummyIngredients = ["Tomatoes", "Cheese", "Pasta"];
  const dummyAllergies = ["Peanuts", "Shellfish", "Eggs"];
  const dummyRecipes = ["Pasta with Tomato Sauce", "Grilled Cheese Sandwich"];

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

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
            {dummyIngredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientItem}>
                {ingredient}
              </Text>
            ))}
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
            {dummyAllergies.map((allergy, index) => (
              <Text key={index} style={styles.ingredientItem}>
                {allergy}
              </Text>
            ))}
          </View>

          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}

      {/* Step 3 - Enter Maximum Cooking Time */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Cooking Time</Text>
          <Text style={styles.subText}>
            What is the maximum cooking time you prefer? (in minutes)
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter time in minutes"
            placeholderTextColor="gray"
            value={maxCookTime}
            onChangeText={setMaxCookTime}
            keyboardType="numeric"
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

          <TouchableOpacity style={styles.submitButton} onPress={nextStep}>
            <Text style={styles.submitButtonText}>Get Recipes</Text>
          </TouchableOpacity>

          <Button title="Back" onPress={prevStep} />
        </View>
      )}

      {/* Step 5 - Display Recipes */}
      {step === 4 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Here are your recipes!</Text>

          <View style={styles.ingredientContainer}>
            {dummyRecipes.map((recipe, index) => (
              <Text key={index} style={styles.ingredientItem}>
                {recipe}
              </Text>
            ))}
          </View>

          <Button title="Finish" onPress={() => setStep(0)} />
        </View>
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
});

export default InteractiveBottomSheet;
