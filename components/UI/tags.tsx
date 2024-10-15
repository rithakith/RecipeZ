import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

type TagsProps = {
  tags: string[];
  onSelectTag: (tag: string) => void;
};

const Tags: React.FC<TagsProps> = ({ tags, onSelectTag }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleTags = showAll ? tags : tags.slice(0, 6); // Initially show 6 tags

  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  return (
    <View style={{ position: "relative" }}>
      {/* If showAll is false, allow horizontal scrolling */}
      {!showAll ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tagsContainer}>
            {visibleTags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tagButton}
                onPress={() => onSelectTag(tag)}
              >
                <Text>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        // If showAll is true, display all tags wrapped in rows
        <View style={[styles.tagsContainer, styles.wrapContainer]}>
          {visibleTags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tagButton}
              onPress={() => onSelectTag(tag)}
            >
              <Text>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Show "See More" button if there are more than 6 tags */}
      {tags.length > 6 && (
        <TouchableOpacity onPress={handleShowMore} style={styles.seeMoreButton}>
          <Text style={styles.seeMoreText}>
            {showAll ? "See Less" : "See More"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    marginLeft: 10,
  },
  wrapContainer: {
    flexWrap: "wrap",
  },
  tagButton: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    margin: 5,
    backgroundColor: "#F1F5F5",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  seeMoreButton: {
    position: "absolute",
    top: -35,
    right: 25,
  },
  seeMoreText: {
    color: "#70B9BE",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Tags;
