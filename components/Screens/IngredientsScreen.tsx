import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';

// Define types for your recipe and props
type Recipe = {
  image: string;
  recipe_name: string;
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

type IngredientsScreenProps = {
  route: {
    params: {
      recipe: Recipe;
    };
  };
};

const IngredientsScreen: React.FC<IngredientsScreenProps> = ({ route }) => {
  const { recipe } = route.params; // Access the passed recipe data
  const [activeTab, setActiveTab] = useState<'Ingredients' | 'Instructions'>('Ingredients');

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{recipe.recipe_name}</Text>
        <Text style={styles.time}>{recipe.time}</Text>
        <Text style={styles.rating}>{recipe.rating} ⭐ ({recipe.reviews} Reviews)</Text>
        <Text style={styles.description}>{recipe.description}</Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>{recipe.carbs}g Carbs</Text>
          <Text style={styles.stat}>{recipe.proteins}g Proteins</Text>
          <Text style={styles.stat}>{recipe.kcal} Kcal</Text>
          <Text style={styles.stat}>{recipe.fats}g Fats</Text>
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
              <Text style={styles.stepText}>{ingredient}</Text>
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
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  stat: { fontSize: 14, color: '#666' },
  tab: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  tabButton: { padding: 10 },
  activeTab: { backgroundColor: '#000' },
  activeTabText: { color: '#fff' },
  tabText: { color: '#000' }, // Text color for inactive tabs
  step: { padding: 15, backgroundColor: '#f0f0f0', marginVertical: 5, borderRadius: 10 },
  stepText: { fontSize: 16, fontWeight: 'bold' },
  ingredient: { padding: 15, backgroundColor: '#f0f0f0', marginVertical: 5, borderRadius: 10 },
});

export default IngredientsScreen;
