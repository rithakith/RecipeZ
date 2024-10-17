import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Importing icons
import RecipeCard from "../UI/RecipeCard";

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

const url = process.env.EXPO_PUBLIC_API_URL;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation(); // Hook to navigate between screens
  const [recipes, setRecipes] = useState<Recipe[]>([]); // State to store recipes
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Dummy data
  const user = {
    username: "Akith Chandinu",
    email: "akith.chandinu@gmail.com",
    image:
      "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/50dab922-5d48-4c6b-8725-7fd0755d9334/3a3f2d35-8167-4708-9ef0-bdaa980989f9.png", // Placeholder image
    allergies: ["Peanuts", "Shellfish"],
    healthGoals: ["Weight Loss", "Improve Strength"],
    dietaryPreferences: ["Vegetarian", "Low Carb"],
  };

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

  const handleRecipeSelect = (recipe: Recipe) => {
    console.log(recipe);
    navigation.navigate("Ingredients", { recipe });
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header Icons */}
        <View style={styles.header}>
          {/* Edit Icon */}
          <TouchableOpacity style={styles.editButton}>
            <Text style={{ fontSize: 16 }}>Edit</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Profile Information</Text>

          {/* Settings Icon */}
          <TouchableOpacity style={styles.settingButton}>
            <Ionicons name="settings" size={20} color="#042628" />
          </TouchableOpacity>
        </View>

        <View style={styles.section1}>
          {/* Profile Image */}
          <Image source={{ uri: user.image }} style={styles.profileImage} />

          {/* Personal Info */}
          <Text style={styles.uname}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.section2}>
          {/* Allergies */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergies:</Text>
            <Text style={styles.value}>{user.allergies.join(", ")}</Text>
          </View>

          {/* Health Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Goals:</Text>
            <Text style={styles.value}>{user.healthGoals.join(", ")}</Text>
          </View>

          {/* Dietary Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dietary Preferences:</Text>
            <Text style={styles.value}>
              {user.dietaryPreferences.join(", ")}
            </Text>
          </View>

          {/* edit info button */}
          <TouchableOpacity
            style={styles.editInfo}
            onPress={() => navigation.navigate("QuestionScreen")}
          >
            <Ionicons name="create" size={20} color="#fff" />
            <Text style={{ color: "#fff" }}>Edit Info</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.favouriteSection}>
          <Text style={styles.favouriteTitle}>Favourite</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recipeScroll}
          >
            {recipes.slice(0, 5).map((recipe) => (
              <TouchableOpacity
                key={recipe.recipe_id}
                onPress={() => navigation.navigate("Ingredients", { recipe })}
              >
                <RecipeCard
                  recipe={recipe}
                  onFavoriteToggle={() =>
                    handleFavoriteToggle(recipe.recipe_id)
                  }
                  isFavorite={favorites.has(recipe.recipe_id)}
                  onRecipeSelect={handleRecipeSelect}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  container: {
    display: "flex",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
    position: "relative",
    height: "100%",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
    paddingHorizontal: 10,
    position: "relative",
  },
  title: {
    flex: 1, // Ensures the title takes up the remaining space between the icons
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center", // Center the text within the space
    alignSelf: "center", // Keep the title centered within the flex space
  },
  editButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E8FEFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    position: "absolute",
    top: -35,
    left: 0,
  },
  settingButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E8FEFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    position: "absolute",
    top: -35,
    right: 0,
  },
  section1: {
    width: "100%",
    paddingTop: 50,
    paddingHorizontal: 30,
    paddingBottom: 20,
    backgroundColor: "#E8FEFF",
    borderRadius: 15,
    marginTop: 40,
    marginBottom: 20,
    marginHorizontal: 20,
    position: "relative",
    elevation: 3,
    shadowColor: "#000",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 75,
    marginBottom: 20,
    position: "absolute",
    left: 20,
    top: -50,
    borderWidth: 3,
    borderColor: "#70b9be",
  },
  uname: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#333",
  },
  section2: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: "#E8FEFF",
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    position: "relative",
    elevation: 3,
    shadowColor: "#000",
  },
  value: {
    fontSize: 18,
    color: "#333",
  },
  section: {
    marginVertical: 10,
    width: "100%",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  editInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#70b9be",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
  },
  favouriteSection: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
  favouriteTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recipeScroll: {
    paddingLeft: 10,
  },
});

export default ProfileScreen;
