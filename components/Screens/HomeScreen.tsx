import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import RecipeCard from "../UI/RecipeCard";
import Tags from "../UI/tags";
import cookieimg from "../../assets/images/cookie.png";

// Define a type for the recipe data
type Recipe = {
  recipe_id: number;
  title: string;
  images: string;
  cook_time: number;
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

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const url = process.env.EXPO_PUBLIC_API_URL;
  console.log("url", url);
  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${url}/api/recipes`);
        const data: Recipe[] = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  // Fetch unique tags
  useEffect(() => {
    const fetchUniqueTags = async () => {
      try {
        const response = await fetch(`${url}/api/uniquetags`);
        const tags: string[] = await response.json();
        setUniqueTags(tags.map((tag) => tag.replace(/[^a-zA-Z0-9 ]/g, "")));
      } catch (error) {
        console.error("Error fetching unique tags:", error);
      }
    };
    fetchUniqueTags();
  }, []);

  const handleRecipeSelect = (recipe: Recipe) => {
    console.log(recipe);
    navigation.navigate("Ingredients", { recipe });
  };

  // Handle tag selection and fetch recipes
  const handleTagSelect = async (tag: string) => {
    try {
      const response = await fetch(`${url}/api/recipesbytag?tag=${tag}`);
      const filteredRecipes = await response.json();
      navigation.navigate("RecipeCollection", {
        recipes: filteredRecipes,
        title: tag,
      });
    } catch (error) {
      console.error("Error fetching recipes by tag:", error);
    }
  };

  // Toggle favorite status of a recipe
  const handleFavoriteToggle = (recipeId: number) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = new Set(prevFavorites);
      if (updatedFavorites.has(recipeId)) {
        updatedFavorites.delete(recipeId);
      } else {
        updatedFavorites.add(recipeId);
      }
      return updatedFavorites;
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi Alena Sabyan</Text>
        <Text style={styles.question}>
          <Image source={cookieimg} style={styles.image} /> What are you cooking
          today?
        </Text>
      </View>

      {/* Featured Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginLeft: 10 }}
        >
          {recipes.slice(0, 5).map((recipe) => (
            <TouchableOpacity
              key={recipe.recipe_id}
              onPress={() => navigation.navigate("Ingredients", { recipe })}
            >
              <RecipeCard
                recipe={recipe}
                onFavoriteToggle={() => handleFavoriteToggle(recipe.recipe_id)}
                isFavorite={favorites.has(recipe.recipe_id)}
                onRecipeSelect={handleRecipeSelect}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tags Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <Tags tags={uniqueTags} onSelectTag={handleTagSelect} />
      </View>

      {/* Popular Recipes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Recipes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recipes.slice(5, 10).map((recipe) => (
            <RecipeCard
              key={recipe.recipe_id}
              recipe={recipe}
              onFavoriteToggle={() => handleFavoriteToggle(recipe.recipe_id)}
              isFavorite={favorites.has(recipe.recipe_id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Recommended Recipes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Just for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recipes.slice(10, 15).map((recipe) => (
            <RecipeCard
              key={recipe.recipe_id}
              recipe={recipe}
              onFavoriteToggle={() => handleFavoriteToggle(recipe.recipe_id)}
              isFavorite={favorites.has(recipe.recipe_id)}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 20 },
  header: { paddingHorizontal: 25, paddingVertical: 25 },
  image: { width: 20, height: 20 },
  greeting: { fontSize: 28, fontWeight: "bold" },
  question: { fontSize: 16 },
  section: { marginVertical: 10 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 25,
  },
  featuredCard: { marginRight: 10, width: 300, height: 200 },
});

export default HomeScreen;
