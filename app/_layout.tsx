// _layout.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import HomeScreen from '@/components/Screens/HomeScreen';
import IngredientsScreen from '@/components/Screens/IngredientsScreen';
import SearchScreen from '@/components/Screens/SearchScreen';

// Define types for navigation
type RootStackParamList = {
  HomeScreen: undefined; // No params
  Ingredients: { recipe: any }; // Adjust 'any' to your recipe type
};

type TabParamList = {
  Home: undefined;
  Search: undefined;
};

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen"  // Changed from "Home" to "HomeScreen"
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Ingredients" 
        component={IngredientsScreen} 
        options={{ title: 'Recipe Details' }} 
      />
    </Stack.Navigator>
  );
};

const Layout: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: string;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Search') {
              iconName = 'search';
            } else {
              iconName = 'home'; // Default icon
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack} // Use HomeStack instead of HomeScreen
          options={{ title: 'Home' }} 
        />
        <Tab.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ title: 'Search Recipes' }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Layout;
