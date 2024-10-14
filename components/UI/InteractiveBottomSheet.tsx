// InteractiveBottomSheet.tsx

import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";

const InteractiveBottomSheet: React.FC = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

  return (
    <BottomSheetView style={styles.container}>
      {/* Step 1 */}
      {step === 0 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Find Your Perfect Recipe</Text>
          <Text style={styles.subText}>What would you like to do?</Text>
          <TouchableOpacity style={styles.optionButton} onPress={nextStep}>
            <Text style={styles.optionText}>1. Find a recipe with existing ingredients</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={nextStep}>
            <Text style={styles.optionText}>2. I don't need to select ingredients</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Got it! These are the ingredients you are allergic to:</Text>
          <Text style={styles.subText}>Peanuts, Shellfish, Eggs</Text>
          <Text style={styles.subText}>We will show you recipes that won't include these.</Text>
          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}

      {/* Step 3 */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Select from these tags what you'd like to include in your recipe:</Text>
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

      {/* Step 4 */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Anything else you want to suggest?</Text>
          <Text style={styles.subText}>We will try our best to satisfy your requirements.</Text>
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
      {step === 4 && (
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
    padding: 20,
    alignItems: "center",
  },
  stepContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    borderColor: "#70B9BE",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: '80%',
    alignItems: "center",
  },
  optionText: {
    color: "#70B9BE",
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "#70B9BE",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#042628",
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default InteractiveBottomSheet;
