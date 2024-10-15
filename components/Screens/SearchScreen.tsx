import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tags from "../UI/tags";
import RecipeCard from "../UI/RecipeCard";
import backArrow from "../../assets/images/arrow_back.png";
const url = process.env.EXPO_PUBLIC_API_URL;

type Recipe = {
  recipe_id: number;
  title: string;
  images: string[];
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
  const [showPreviousSearches, setShowPreviousSearches] =
    useState<boolean>(false);
  const [fetchedRecipes, setFetchedRecipes] = useState<Recipe[]>([]);
  const [noResultsMessage, setNoResultsMessage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

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

    const fetchStoredSearches = async () => {
      try {
        const storedSearches = await AsyncStorage.getItem("previousSearches");
        if (storedSearches) {
          setPreviousSearches(JSON.parse(storedSearches));
        }
      } catch (error) {
        console.error("Error fetching previous searches:", error);
      }
    };

    fetchUniqueTags();
    fetchStoredSearches();
  }, []);

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

  useEffect(() => {
    const fetchRecipes = async () => {
      if (searchTerm.trim() === "") {
        try {
          const response = await fetch(`${url}/api/recipes`);
          const allRecipes = await response.json();
          setFetchedRecipes(allRecipes);
          setNoResultsMessage(null); // Clear message
        } catch (error) {
          console.error("Error fetching all recipes:", error);
        }
        return;
      }
      try {
        const response = await fetch(
          `${url}/api/searchrecipes?searchTerm=${searchTerm}`
        );

        const recipes = await response.json();
        setFetchedRecipes(recipes);
        if (recipes.length === 0) {
          setNoResultsMessage(
            "No recipes found for your search. Please try again."
          );
        } else {
          setNoResultsMessage(null);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") return;
    const updatedSearches = [...new Set([searchTerm, ...previousSearches])];
    setPreviousSearches(updatedSearches);
    try {
      await AsyncStorage.setItem(
        "previousSearches",
        JSON.stringify(updatedSearches)
      );
    } catch (error) {
      console.error("Error saving previous searches:", error);
    }
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
    setShowPreviousSearches(true);
  };

  const handlePreviousSearchSelect = (search: string) => {
    setSearchTerm(search);
    handleSearch();
  };

  const handleRemoveSearch = async (search: string) => {
    const updatedSearches = previousSearches.filter((item) => item !== search);
    setPreviousSearches(updatedSearches);
    try {
      await AsyncStorage.setItem(
        "previousSearches",
        JSON.stringify(updatedSearches)
      );
    } catch (error) {
      console.error("Error removing previous search:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowPreviousSearches(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Image source={backArrow} style={styles.image} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchTerm}
          onChangeText={(text) => {
            setSearchTerm(text);
            if (text.trim() === "") handleClearSearch();
          }}
          onSubmitEditing={handleSearch}
          onFocus={handleFocus}
        />
      </View>
      {showPreviousSearches && previousSearches.length > 0 && (
        <View style={styles.previousSearchesContainer}>
          <Text style={styles.recentText}>Recent</Text>

          <View style={styles.recentSection}>
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
        </View>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <Tags tags={uniqueTags} onSelectTag={handleTagSelect} />
      </View>

      {fetchedRecipes.length > 0 ? (
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
      ) : (
        noResultsMessage && <Text>{noResultsMessage}</Text>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 2,
    borderRadius: 15,
  },
  previousSearchesContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  recentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#70b9be",
    marginBottom: 5,
  },
  recentSection: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  searchItemContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 100,
    backgroundColor: "#f1f5f5",
    borderRadius: 15,
    padding: 10,
  },
  section: { marginVertical: 10, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  searchItem: {
    // paddingHorizontal: 10,
    borderColor: "#ddd",
    flex: 1,
  },
  closeIcon: {
    // paddingHorizontal: 10,
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
  noResultsContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
  },
});

export default SearchScreen;
