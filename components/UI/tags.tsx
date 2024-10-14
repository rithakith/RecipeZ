// UI/Tags.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type TagsProps = {
  tags: string[];
  onSelectTag: (tag: string) => void; // Handler for when a tag is selected
};

const Tags: React.FC<TagsProps> = ({ tags, onSelectTag }) => {
  return (
    <View style={styles.tagsContainer}>
      {tags.map((tag, index) => (
        <TouchableOpacity key={index} style={styles.tagButton} onPress={() => onSelectTag(tag)}>
          <Text>{tag}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping for the tags
  },
  tagButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
});

export default Tags;
