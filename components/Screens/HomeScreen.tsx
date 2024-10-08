import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import RecipeCard from '../UI/RecipeCard';

// Define a type for the recipe data
type Recipe = {
  recipe_name: string;
  image: string;
  time: string;
  rating: number;
  reviews: number;
  description: string;
  carbs: number;
  proteins: number;
  kcal: number;
  fats: number;
  ingredients: string[];
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
        const response = await fetch('../../assets/data/recipes.json'); // Update with the correct path
        const data: Recipe[] = await response.json(); // Explicitly type the data
        setRecipes(data); // Set the recipes state
      } catch (error) {
        console.error('Error fetching recipes:', error);
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
    navigation.navigate('Ingredients', { recipe }); // Navigate to Ingredients screen
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
          {recipes.slice(0, 5).map(recipe => (
            <TouchableOpacity key={recipe.recipe_name} style={styles.featuredCard} onPress={() => handleRecipeSelect(recipe)}>
              <RecipeCard
                recipe={recipe}
                onFavoriteToggle={() => handleFavoriteToggle(recipe.recipe_name)} 
                isFavorite={false} // Update as necessary based on favorite state
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.categoryContainer}>
          {['All', 'Lunch', 'Dinner', 'Snack'].map(category => (
            <TouchableOpacity key={category} style={styles.categoryButton}>
              <Text>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Recipes</Text>
        <ScrollView horizontal>
          {recipes.slice(0, 5).map(recipe => (
            <RecipeCard
              key={recipe.recipe_name}
              recipe={recipe}
              onFavoriteToggle={() => handleFavoriteToggle(recipe.recipe_name)} 
              isFavorite={false} // Update as necessary based on favorite state
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Just for You</Text>
        <ScrollView horizontal>
          {recipes.slice(0, 5).map(recipe => (
            <RecipeCard
              key={recipe.recipe_name}
              recipe={recipe}
              onFavoriteToggle={() => handleFavoriteToggle(recipe.recipe_name)} 
              isFavorite={false} // Update as necessary based on favorite state
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  question: { fontSize: 16, color: '#666' },
  section: { marginVertical: 10, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  categoryButton: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 },
  featuredCard: {
    marginRight: 10, // Space between cards
    width: 300, // Fixed width for featured cards
  },
});

export default HomeScreen;
