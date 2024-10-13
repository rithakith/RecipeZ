import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define a type for the recipe
type Recipe = {
  title: string;
  images: string;
  calories: number;
  cook_time: string;
};

type RecipeCardProps = {
  recipe: Recipe;
  onFavoriteToggle: (recipeName: string) => void;
  onRecipeSelect: (recipe: Recipe) => void;
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onFavoriteToggle, onRecipeSelect }) => {
  const [isFavorite, setIsFavorite] = useState(false);
// console.log("image link",recipe.images[0].url);
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavoriteToggle(recipe.title); // Call parent handler to update state or log
  };

  return (
    <TouchableOpacity onPress={() => onRecipeSelect(recipe)} style={styles.card}>
      <Image source={{ uri: recipe.images[0].url }} style={styles.image} />
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.details}>Calories: {recipe.calories}</Text>
      <Text style={styles.details}>Cook Time: {recipe.cook_time}</Text>
      <TouchableOpacity onPress={toggleFavorite}>
        <Ionicons 
          name={isFavorite ? 'heart' : 'heart-outline'} 
          size={24} 
          color={isFavorite ? 'red' : 'gray'} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  details: {
    fontSize: 14,
    color: 'gray',
  },
});

export default RecipeCard;
