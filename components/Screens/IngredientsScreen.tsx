import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons
import { LinearGradient } from "expo-linear-gradient";

type Recipe = {
  recipe_id: number;
  images: string;
  title: string;
  cook_time: number;
  ratings: {
    rating_count: number;
    average_rating: number;
  };
  reviews: number;
  description: string;
  nutrition: {
    calories: string;
    carbohydrates: string;
    fat: string;
    fiber: string;
    protein: string;
    sugar: string;
  };
  ingredients: {
    name: string;
    unit: string;
    quantity: number;
    preparation?: string;
  }[];
  steps: string[];
};

type IngredientsScreenProps = {
  route: {
    params: {
      recipe: Recipe;
    };
  };
};

const IngredientsScreen: React.FC<IngredientsScreenProps> = ({ route }) => {
  const { recipe } = route.params;
  const [activeTab, setActiveTab] = useState<"Ingredients" | "Instructions">(
    "Ingredients"
  );
  const navigation = useNavigation(); // Hook to navigate between screens

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.images[0].url }} style={styles.image} />

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.heartButton}>
        <Ionicons name="heart" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.details}>
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.time}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={{ fontSize: 16 }}>{recipe.cook_time} mins</Text>
          </View>
        </View>
        <View style={styles.subHeading}>
          <Text style={styles.rating}>⭐️ {recipe.ratings.average_rating}</Text>
          <Text style={styles.reviewCount}>
            ({recipe.ratings.rating_count} Ratings)
          </Text>
        </View>

        <Text style={styles.description}>{recipe.description}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.nutriIcon}>
              <Icon name="fire" size={20} color="#042628" />
            </View>
            <Text style={styles.statText}>
              Calories: {recipe.nutrition.calories} kcal
            </Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.nutriIcon}>
              <Icon name="pie-chart" size={20} color="#042628" />
            </View>
            <Text style={styles.statText}>
              Carbs: {recipe.nutrition.carbohydrates}g
            </Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.nutriIcon}>
              <Icon name="balance-scale" size={20} color="#042628" />
            </View>
            <Text style={styles.statText}>
              Protein: {recipe.nutrition.protein}g
            </Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.nutriIcon}>
              <Icon name="tint" size={20} color="#042628" />
            </View>
            <Text style={styles.statText}>Fat: {recipe.nutrition.fat}g</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.nutriIcon}>
              <Icon name="leaf" size={20} color="#042628" />
            </View>
            <Text style={styles.statText}>
              Fiber: {recipe.nutrition.fiber}g
            </Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.nutriIcon}>
              <Icon name="cube" size={20} color="#042628" />
            </View>
            <Text style={styles.statText}>
              Sugar: {recipe.nutrition.sugar}g
            </Text>
          </View>
        </View>

        <View style={styles.tab}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "Ingredients" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Ingredients")}
          >
            <Text
              style={
                activeTab === "Ingredients"
                  ? styles.activeTabText
                  : styles.tabText
              }
            >
              Ingredients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "Instructions" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Instructions")}
          >
            <Text
              style={
                activeTab === "Instructions"
                  ? styles.activeTabText
                  : styles.tabText
              }
            >
              Instructions
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "Ingredients"
          ? recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredient}>
                <Text style={styles.ingredientText}>{ingredient.name}</Text>
                <Text style={styles.detailText}>
                  {ingredient.quantity} {ingredient.unit}
                  {ingredient.preparation ? `, ${ingredient.preparation}` : ""}
                </Text>
              </View>
            ))
          : recipe.steps.map((step, index) => (
              <TouchableOpacity key={index} style={styles.step}>
                <Text style={styles.stepText}>
                  {index + 1}. {step}
                </Text>
              </TouchableOpacity>
            ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 5,
  },
  heartButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 5,
  },
  image: { width: "100%", height: 250 },
  details: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "bold" },
  time: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  subHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: -2,
  },
  rating: { fontSize: 16, color: "#333", fontWeight: "bold" },
  reviewCount: { fontSize: 16, color: "#666" },
  description: { fontSize: 18, color: "#333", marginVertical: 10 },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginVertical: 15,
    gap: 2,
  },
  statItem: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  nutriIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dedede",
    padding: 1,
    borderRadius: 10,
  },
  statText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
    fontWeight: "bold",
  },
  tab: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 10,
    padding: 6,
    backgroundColor: "#dedede",
    borderRadius: 15,
  },
  tabButton: {
    padding: 10,
    width: "50%",
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: { backgroundColor: "#042628" },
  activeTabText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  tabText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  step: {
    padding: 15,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 10,
  },
  stepText: { fontSize: 16, fontWeight: "bold" },
  ingredient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
  },
  ingredientText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  detailText: { fontSize: 14, color: "#666" },
});

export default IngredientsScreen;
