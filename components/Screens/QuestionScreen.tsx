import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

type QuestionScreenProps = {};

const QuestionScreen: React.FC<QuestionScreenProps> = () => {
  const [step, setStep] = useState(1);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const navigation = useNavigation();

  const questions = [
    {
      step: 1,
      topic: "Dietary Preference",
      question: [
        "What is your dietary preference?",
        "Do you have any food allergies?",
      ],
      answers: [
        ["Vegetarian", "Vegan", "Pescatarian", "Other"],
        ["Gluten", "Nuts", "Dairy", "None"],
      ],
    },
    {
      step: 2,
      question: "What ingredients do you currently have in your kitchen?",
      answers: [], // No predefined answers for step 2
    },
    {
      step: 3,
      question: "What is your primary health goal?",
      answers: ["Weight Loss", "Muscle Gain", "Maintain Weight", "Other"],
    },
  ];

  const currentQuestion = questions.find((q) => q.step === step);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigation.navigate("Home");
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const addIngredient = () => {
    if (inputValue.trim()) {
      setIngredients([...ingredients, inputValue]);
      setInputValue("");
    }
  };

  const renderIngredient = ({ item }: { item: string }) => (
    <Text style={styles.ingredientItem}>{item}</Text>
  );

  return (
    <View style={styles.container}>
      {/* Stepper */}
      <View style={styles.stepper}>
        {questions.map((q, index) => (
          <React.Fragment key={index}>
            <View
              style={[
                styles.step,
                step === q.step ? styles.activeStep : styles.inactiveStep,
              ]}
            >
              <Text style={styles.stepText}>{q.step}</Text>
            </View>
            {/* Add line between steps except for the last step */}
            {index < questions.length - 1 && <View style={styles.line} />}
          </React.Fragment>
        ))}
      </View>

      {/* Display the current question */}
      {Array.isArray(currentQuestion?.question) ? (
        currentQuestion?.question.map((qText, questionIndex) => (
          <View key={questionIndex} style={styles.questionSection}>
            <Text style={styles.questionText}>{qText}</Text>
            <View>
              {currentQuestion?.answers[questionIndex].map((answer, index) => (
                <TouchableOpacity key={index} style={styles.answerButton}>
                  <Text style={styles.answerText}>{answer}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      ) : (
        <>
          <Text style={styles.questionText}>{currentQuestion?.question}</Text>

          {/* Step 2 input section */}
          {step === 2 && (
            <View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="Type an ingredient"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addIngredient}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Display the added ingredients */}
              <FlatList
                data={ingredients}
                renderItem={renderIngredient}
                keyExtractor={(item, index) => index.toString()}
                style={styles.ingredientList}
              />
            </View>
          )}

          {/* Step 3 normal question */}
          {step !== 2 && (
            <View>
              {currentQuestion?.answers.map((answer, index) => (
                <TouchableOpacity key={index} style={styles.answerButton}>
                  <Text style={styles.answerText}>{answer}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}

      {/* Navigation buttons */}
      <View style={styles.buttonSection}>
        {step === 1 && (
          <TouchableOpacity
            style={[styles.button, styles.previousButton]}
            onPress={() => navigation.navigate("DetailInquiry")}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {step > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.previousButton]}
            onPress={handlePrevious}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            step === 3 ? styles.doneButton : styles.nextButton,
          ]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>{step === 3 ? "Done" : "Next"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    gap: 20,
    justifyContent: "space-around",
    marginTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  stepper: {
    position: "relative",
    top: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  step: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
  },
  activeStep: {
    backgroundColor: "#70B9BE",
    borderColor: "#70B9BE",
  },
  inactiveStep: {
    backgroundColor: "white",
    borderColor: "#d3d3d3",
  },
  stepText: {
    color: "black",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#d3d3d3",
  },
  questionSection: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  answerButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  answerText: {
    textAlign: "center",
    fontSize: 16,
  },
  buttonSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: {
    width: "45%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  previousButton: {
    backgroundColor: "#d3d3d3",
  },
  nextButton: {
    backgroundColor: "#70B9BE",
  },
  doneButton: {
    backgroundColor: "#70B9BE",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#70B9BE",
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  ingredientList: {
    marginTop: 10,
  },
  ingredientItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    borderRadius: 8,
  },
});

export default QuestionScreen;
