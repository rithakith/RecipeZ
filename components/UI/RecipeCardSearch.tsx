import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define a type for the recipe
type Recipe = {
  title: string;
  images: string;
  cook_time: string;
  ratings: number;
};

type RecipeCardSearchProps = {
  recipe: Recipe;
  onFavoriteToggle: (recipeName: string) => void;
  onRecipeSelect: (recipe: Recipe) => void;
};

const RecipeCardSearch: React.FC<RecipeCardSearchProps> = ({
  recipe,
  onFavoriteToggle,
  onRecipeSelect,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavoriteToggle(recipe.title); // Call parent handler to update state or log
  };

  // Function to render stars for ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0.5; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < rating ? "star" : "star-outline"}
          size={16}
          color={"#70b9be"}
        />
      );
    }
    return stars;
  };

  return (
    <TouchableOpacity
      onPress={() => onRecipeSelect(recipe)}
      style={styles.card}
    >
      <Image source={{ uri: recipe.images[0].url }} style={styles.image} />

      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.ratingsContainer}>
            {renderStars(recipe.ratings.average_rating)}
          </View>
          <Text style={styles.details}>Cook Time: {recipe.cook_time}</Text>
        </View>

        <TouchableOpacity onPress={toggleFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={32}
            color={isFavorite ? "red" : "#042628"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", // Makes the card longer
    alignItems: "center",
    backgroundColor: "#F1F5F5",
    borderRadius: 12,
    shadowColor: "#70b9be",
    shadowOffset: { width: 0, height: 20 },
    elevation: 4,
    marginVertical: 10,
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    elevation: 2,
    shadowColor: "#70b9be",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },
  textContainer: {
    flexShrink: 1,
    maxWidth: "85%", // Ensures text doesn't overlap with the favorite icon
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ratingsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  details: {
    fontSize: 12,
    color: "#042628",
  },
});

export default RecipeCardSearch;
