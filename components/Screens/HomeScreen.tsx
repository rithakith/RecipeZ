import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import RecipeCard from "../UI/RecipeCard";

// Define a type for the recipe data
type Recipe = {
  recipe_id: number;
  title: string;
  images: string;
  cook_time: number; // Adjusted to match your API structure
  rating: number;
  reviews: number;
  description: string;
  nutrition: {
    carbohydrates: number;
    protein: number;
    calories: number;
    fat: number;
  };
  ingredients: {
    name: string;
    unit: string;
    quantity: number;
    preparation?: string;
  }[];
  steps: string[];
};

type HomeScreenProps = {
  navigation: {
    navigate: (screen: string, params?: { recipe: Recipe }) => void;
  };
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]); // State for storing recipes

  // Fetch the JSON data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8083/api/recipes"); // Fetch from the API
        const data: Recipe[] = await response.json(); // Explicitly type the data
        console.log("data", data);
        console.log("recipe image",typeof(data[0].images[0].url), data[0].images[0].url);
        // Process data to fit the expected structure
        const processedData = data.map((recipe) => ({
          
          recipe_id: recipe.recipe_id,
          title: recipe.title,
          images: recipe.images[0].url|| '', // Get the first image URL
          cook_time: recipe.cook_time,
          // rating: recipe.ratings.average_rating,
          // reviews: recipe.ratings.rating_count,
          description: recipe.description,
          nutrition: {
            carbohydrates: recipe.nutrition.carbohydrates,
            protein: recipe.nutrition.protein,
            calories: recipe.nutrition.calories,
            fat: recipe.nutrition.fat,
          },
          ingredients: recipe.ingredients.map((ingredient) => ingredient.name), // Only keep ingredient names
          steps: recipe.steps,
        }));
 
        setRecipes(processedData); // Set the recipes state
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchData();
  }, []);

  const handleFavoriteToggle = (recipeName: string) => {
    // Logic to toggle favorite status
    console.log(`Toggled favorite for: ${recipeName}`);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    console.log(recipe);
    navigation.navigate("Ingredients", { recipe }); // Navigate to Ingredients screen
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi Alena Sabyan</Text>
        <Text style={styles.question}>What are you cooking today?</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recipes.slice(0, 5).map((recipe) => (
            <TouchableOpacity
              key={recipe.recipe_id}
              style={styles.featuredCard}
              onPress={() => handleRecipeSelect(recipe)}
            >
              <RecipeCard
                recipe={recipe}
                onFavoriteToggle={() =>
                  handleFavoriteToggle(recipe.title)
                }
                isFavorite={false} // Update as necessary based on favorite state
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.categoryContainer}>
          {["All", "Lunch", "Dinner", "Snack"].map((category) => (
            <TouchableOpacity key={category} style={styles.categoryButton}>
              <Text>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Recipes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recipes.slice(0, 5).map((recipe) => (
            <RecipeCard
              key={recipe.recipe_id}
              recipe={recipe}
              onFavoriteToggle={() => handleFavoriteToggle(recipe.title)}
              isFavorite={false} // Update as necessary based on favorite state
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Just for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recipes.slice(0, 5).map((recipe) => (
            <RecipeCard
              key={recipe.recipe_id}
              recipe={recipe}
              onFavoriteToggle={() => handleFavoriteToggle(recipe.title)}
              isFavorite={false} // Update as necessary based on favorite state
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 20 },
  greeting: { fontSize: 24, fontWeight: "bold" },
  question: { fontSize: 16, color: "#666" },
  section: { marginVertical: 10, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  categoryContainer: { flexDirection: "row", justifyContent: "space-between" },
  categoryButton: { padding: 10, backgroundColor: "#f0f0f0", borderRadius: 10 },
  featuredCard: {
    marginRight: 10, // Space between cards
    width: 300, // Fixed width for featured cards
  },
});

export default HomeScreen;
