import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import LandingScreen from "@/components/Screens/LandingScreen";
import HomeScreen from "@/components/Screens/HomeScreen";
import IngredientsScreen from "@/components/Screens/IngredientsScreen";
import SearchScreen from "@/components/Screens/SearchScreen";
import DetailInquiryScreen from "@/components/Screens/DetailInquiryScreen";

type RootStackParamList = {
  Landing: undefined;
  Home: undefined;
  Ingredients: { recipe: any };
  DetailInquiry: undefined;
};

type TabParamList = {
  Home: undefined;
  Search: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen" // Changed name to avoid conflict
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Ingredients"
        component={IngredientsScreen}
        options={{ title: "Recipe Details" }}
      />
      <Stack.Screen
        name="DetailInquiry"
        component={DetailInquiryScreen}
        options={{ title: "Detail Inquiry" }} // Add title for the screen
      />
    </Stack.Navigator>
  );
};

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Search") {
            iconName = "search";
          } else {
            iconName = "home";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack} // This remains the same
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Search Recipes" }}
      />
    </Tab.Navigator>
  );
};

const Layout: React.FC = () => (
  <NavigationContainer independent={true}>
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailInquiry"
        component={DetailInquiryScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Layout;
