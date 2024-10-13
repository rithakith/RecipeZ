import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Tags from "../UI/tags";
import RecipeCard from "../UI/RecipeCard";

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

const SearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [previousSearches, setPreviousSearches] = useState<string[]>([]);
  const [showPreviousSearches, setShowPreviousSearches] = useState<boolean>(false);
  const [fetchedRecipes, setFetchedRecipes] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchUniqueTags = async () => {
      try {
        const response = await fetch("http://localhost:8083/api/uniquetags");
        const tags: string[] = await response.json();
        setUniqueTags(tags.map((tag) => tag.replace(/[^a-zA-Z0-9 ]/g, "")));
      } catch (error) {
        console.error("Error fetching unique tags:", error);
      }
    };
    fetchUniqueTags();

    const storedSearches = localStorage.getItem("previousSearches");
    if (storedSearches) {
      setPreviousSearches(JSON.parse(storedSearches));
    }
  }, []);

  const handleTagSelect = async (tag: string) => {
    try {
      const response = await fetch(`http://localhost:8083/api/recipesbytag?tag=${tag}`);
      const filteredRecipes = await response.json();
      navigation.navigate("RecipeCollection", {
        recipes: filteredRecipes,
        title: tag,
      });
    } catch (error) {
      console.error("Error fetching recipes by tag:", error);
    }
  };

  // Fetch recipes based on search term
  useEffect(() => {
    const fetchRecipes = async () => {
      if (searchTerm.trim() === "") {
        setFetchedRecipes([]); // Clear recipes if searchTerm is empty
        return;
      }
      try {
        const response = await fetch(`http://localhost:8083/api/searchrecipes?searchTerm=${searchTerm}`);
        const recipes = await response.json();
        setFetchedRecipes(recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [searchTerm]); // Dependency on searchTerm

  const handleSearch = () => {
    if (searchTerm.trim() === "") return;
    const updatedSearches = [...new Set([searchTerm, ...previousSearches])];
    setPreviousSearches(updatedSearches);
    localStorage.setItem("previousSearches", JSON.stringify(updatedSearches));
    setShowPreviousSearches(true); // Show previous searches after search
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    navigation.navigate("Ingredients", { recipe });
  };

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

  const handleFocus = () => {
    setShowPreviousSearches(false); // Hide previous searches when input is focused
  };

  const handlePreviousSearchSelect = (search: string) => {
    setSearchTerm(search);
    handleSearch();
  };

  const handleRemoveSearch = (search: string) => {
    const updatedSearches = previousSearches.filter((item) => item !== search);
    setPreviousSearches(updatedSearches);
    localStorage.setItem("previousSearches", JSON.stringify(updatedSearches));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          onFocus={handleFocus}
        />
      </View>
      {/* Show previous searches only if the search has been submitted */}
      {showPreviousSearches && previousSearches.length > 0 && (
        <View style={styles.previousSearchesContainer}>
          {previousSearches.map((item) => {
            if (!item) return null;
            return (
              <View key={item} style={styles.searchItemContainer}>
                <TouchableOpacity
                  style={styles.searchItem}
                  onPress={() => handlePreviousSearchSelect(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRemoveSearch(item)}
                  style={styles.closeIcon}
                >
                  <Text style={styles.closeText}>×</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <Tags tags={uniqueTags} onSelectTag={handleTagSelect} />
      </View>
      {/* Display fetched recipes */}
      {searchTerm.trim() && fetchedRecipes.length > 0 && (
        <View style={styles.recipesContainer}>
          {fetchedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.recipe_id}
              recipe={recipe}
              onFavoriteToggle={() => handleFavoriteToggle(recipe.recipe_id)}
              isFavorite={favorites.has(recipe.recipe_id)}
              onRecipeSelect={handleRecipeSelect}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 40 },
  searchContainer: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
  },
  previousSearchesContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  searchItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  section: { marginVertical: 10, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  searchItem: { padding: 10, borderBottomWidth: 1, borderColor: "#ddd", flex: 1 },
  closeIcon: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "#ff0000",
    fontSize: 16,
  },
  recipesContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});

export default SearchScreen;
