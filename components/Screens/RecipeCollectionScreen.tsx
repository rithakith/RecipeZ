import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import RecipeCard from '../UI/RecipeCard';
import { useRoute } from '@react-navigation/native';

type Recipe = {
  title: string;
  image: string;
  calories: number;
  cook_time: string;
};

type RecipeCollectionProps = {
  recipes?: Recipe[]; // Optional in case it's undefined
  title: string;
};

const RecipeCollection: React.FC<RecipeCollectionProps> = () => {
  const route = useRoute();
  const { recipes, title } = route.params as RecipeCollectionProps; // Explicitly type the params

  console.log("recipes", recipes);
  if (!recipes) {
    // Show a loading spinner or a message if recipes is undefined
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading recipes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={index}
            recipe={recipe}
            onFavoriteToggle={() => console.log(`Toggled favorite for: ${recipe.title}`)}
            isFavorite={false} // This can be managed by state if needed
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecipeCollection;
