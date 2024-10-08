import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput style={styles.input} placeholder="Search" />
      </View>
      <View style={styles.categoryContainer}>
        {['All', 'Lunch', 'Dinner', 'Snack'].map(category => (
          <TouchableOpacity key={category} style={styles.categoryButton}>
            <Text>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.recentSearches}>
        {['Pancakes', 'Salad'].map(item => (
          <TouchableOpacity key={item} style={styles.searchItem}>
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, padding: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 10 },
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  categoryButton: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 },
  recentSearches: { marginVertical: 20 },
  searchItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' }
});
