import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';

type Recipe = {
  recipe_id: number;
  images: string;
  title: string;
  cook_time: number;
  ratings:{
    rating_count: number;
    average_rating: number;
  }
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
  ingredients: { name: string; unit: string; quantity: number; preparation?: string }[];
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
  const [activeTab, setActiveTab] = useState<'Ingredients' | 'Instructions'>('Ingredients');

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.images[0].url }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.time}>{recipe.cook_time} mins</Text>
        <Text style={styles.rating}>{recipe.ratings.rating_count} has voted for this </Text>
        <Text style={styles.rating}>{recipe.ratings.average_rating} average rating </Text>

        <Text style={styles.description}>{recipe.description}</Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>Carbs: {recipe.nutrition.carbohydrates}g</Text>
          <Text style={styles.stat}>Protein: {recipe.nutrition.protein}g</Text>
          <Text style={styles.stat}>Calories: {recipe.nutrition.calories} kcal</Text>
          <Text style={styles.stat}>Fat: {recipe.nutrition.fat}g</Text>
          <Text style={styles.stat}>Fiber: {recipe.nutrition.fiber}g</Text>
          <Text style={styles.stat}>Sugar: {recipe.nutrition.sugar}g</Text>
        </View>
        <View style={styles.tab}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Ingredients' && styles.activeTab]}
            onPress={() => setActiveTab('Ingredients')}
          >
            <Text style={activeTab === 'Ingredients' ? styles.activeTabText : styles.tabText}>Ingredients</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Instructions' && styles.activeTab]}
            onPress={() => setActiveTab('Instructions')}
          >
            <Text style={activeTab === 'Instructions' ? styles.activeTabText : styles.tabText}>Instructions</Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'Ingredients' ? (
          recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredient}>
              <Text style={styles.ingredientText}>{ingredient.name}</Text>
              <Text style={styles.detailText}>
                {ingredient.quantity} {ingredient.unit}
                {ingredient.preparation ? `, ${ingredient.preparation}` : ''}
              </Text>
            </View>
          ))
        ) : (
          recipe.steps.map((step, index) => (
            <TouchableOpacity key={index} style={styles.step}>
              <Text style={styles.stepText}>{step}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 200 },
  details: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  time: { fontSize: 14, color: '#666' },
  rating: { fontSize: 16, color: '#333' },
  description: { fontSize: 16, color: '#333', marginVertical: 10 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 10 },
  stat: { fontSize: 14, color: '#666', width: '50%' },
  tab: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  tabButton: { padding: 10 },
  activeTab: { backgroundColor: '#000' },
  activeTabText: { color: '#fff' },
  tabText: { color: '#000' },
  step: { padding: 15, backgroundColor: '#f0f0f0', marginVertical: 5, borderRadius: 10 },
  stepText: { fontSize: 16, fontWeight: 'bold' },
  ingredient: { padding: 15, backgroundColor: '#f0f0f0', marginVertical: 5, borderRadius: 10 },
  ingredientText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  detailText: { fontSize: 14, color: '#666' },
});

export default IngredientsScreen;
