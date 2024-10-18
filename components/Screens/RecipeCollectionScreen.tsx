import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import RecipeCardSearch from "../UI/RecipeCardSearch";

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
  const navigation = useNavigation(); // Hook to navigate between screens

  const handleRecipeSelect = (recipe: Recipe) => {
    console.log(recipe);
    navigation.navigate("Ingredients", { recipe });
  };

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
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#70b9be"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.search}>Search Results: </Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {recipes.map((recipe, index) => (
          <RecipeCardSearch
            key={index}
            recipe={recipe}
            onFavoriteToggle={() =>
              console.log(`Toggled favorite for: ${recipe.title}`)
            }
            isFavorite={false} // This can be managed by state if needed
            onRecipeSelect={() => handleRecipeSelect(recipe)}
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
    paddingTop: 40,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  search: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 10,
  },
  scrollContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecipeCollection;
