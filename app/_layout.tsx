import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// Import your screens
import LandingScreen from "@/components/Screens/LandingScreen";
import LoginScreen from "@/components/Screens/LoginScreen";
import SignUpScreen from "@/components/Screens/SignUpScreen";
import HomeScreen from "@/components/Screens/HomeScreen";
import IngredientsScreen from "@/components/Screens/IngredientsScreen";
import SearchScreen from "@/components/Screens/SearchScreen";

// Define types for navigation
type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;
  HomeScreen: undefined;
  Ingredients: { recipe: any };
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
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Ingredients"
        component={IngredientsScreen}
        options={{ title: "Recipe Details" }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
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
        component={HomeStack}
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

const Layout: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        {/* Landing screen as the initial screen */}
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Layout;
