import React, { useState } from "react";
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

const InteractiveBottomSheet: React.FC = () => {
  const [step, setStep] = useState(0);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [skipIngredients, setSkipIngredients] = useState(false);

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

  // Add ingredient to the list
  const addIngredient = () => {
    if (inputValue.trim()) {
      setIngredients((prevIngredients) => [...prevIngredients, inputValue]);
      setInputValue(""); // Clear the input after adding
    }
  };

  // Skip ingredient selection
  const handleSkipIngredients = () => {
    setSkipIngredients(true);
    nextStep();
  };

  return (
    <BottomSheetView style={styles.container}>
      {/* Step 1 */}
      {step === 0 && (
        <View style={styles.stepContainer}>
          {/* stars icon from fontawesome*/}
          <View style={styles.step1Header}>
            <Icon name="rocket" size={30} color="#70B9BE" />
            <Text style={styles.title}>Find Your Perfect Recipe</Text>
          </View>
          <Text style={styles.subText}>What would you like to do?</Text>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setSkipIngredients(false); // Reset skipping ingredients
              nextStep();
            }}
          >
            <Text style={styles.optionText}>
              1. Find a recipe with existing ingredients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleSkipIngredients}
          >
            <Text style={styles.optionText}>
              2. I don't need to select ingredients
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2 - Add Ingredients */}
      {step === 1 && !skipIngredients && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Add Your Ingredients</Text>
          <Text style={styles.subText}>
            Enter the ingredients you have, and we'll find matching recipes.
          </Text>

          {/* Input for adding ingredients */}
          <TextInput
            style={styles.input}
            placeholder="Enter ingredient"
            placeholderTextColor="gray"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
            <Text style={styles.addButtonText}>Add Ingredient</Text>
          </TouchableOpacity>

          {/* Display added ingredients */}
          <View style={styles.ingredientContainer}>
            {ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientItem}>
                {ingredient}
              </Text>
            ))}
          </View>

          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}

      {/* Step 3 */}
      {(step === 1 && skipIngredients) || step === 2 ? (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>
            Got it! These are the ingredients you are allergic to:
          </Text>
          <Text style={styles.subText}>Peanuts, Shellfish, Eggs</Text>
          <Text style={styles.subText}>
            We will show you recipes that won't include these.
          </Text>
          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      ) : null}

      {/* Step 4 */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>
            Select from these tags what you'd like to include in your recipe:
          </Text>
          <TouchableOpacity style={styles.optionButton} onPress={nextStep}>
            <Text style={styles.optionText}>Vegetarian</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={nextStep}>
            <Text style={styles.optionText}>Gluten-Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={nextStep}>
            <Text style={styles.optionText}>Quick Meals</Text>
          </TouchableOpacity>
          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}

      {/* Step 5 */}
      {step === 4 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Anything else you want to suggest?</Text>
          <Text style={styles.subText}>
            We will try our best to satisfy your requirements.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Additional comments"
            placeholderTextColor="gray"
          />
          <TouchableOpacity style={styles.submitButton} onPress={nextStep}>
            <Text style={styles.submitButtonText}>Get the Recipe</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Final Step - Results */}
      {step === 5 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Here are your results!</Text>
          {/* You can display your results here */}
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
  optionButton: {
    borderColor: "#70B9BE",
    backgroundColor: "#E8F8F5",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 5,
    width: "80%",
    // height: 60,
  },
  optionText: {
    color: "#70B9BE",
    fontSize: 16,
    textAlign: "left",
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
  addButton: {
    backgroundColor: "#042628",
    borderRadius: 10,
    padding: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  ingredientContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // Center the items
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
