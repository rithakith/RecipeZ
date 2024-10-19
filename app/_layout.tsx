import React, { useCallback, useMemo, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import LandingScreen from "@/components/Screens/LandingScreen";
import HomeScreen from "@/components/Screens/HomeScreen";
import IngredientsScreen from "@/components/Screens/IngredientsScreen";
import SearchScreen from "@/components/Screens/SearchScreen";
import RecipeCollection from "@/components/Screens/RecipeCollectionScreen";
import DetailInquiryScreen from "@/components/Screens/DetailInquiryScreen";
import QuestionScreen from "@/components/Screens/QuestionScreen";
import InteractiveBottomSheet from "@/components/UI/InteractiveBottomSheet";
import ProfileScreen from "@/components/Screens/ProfileScreen";
import AuthScreen from "@/components/Screens/AuthScreen";

type RootStackParamList = {
  Landing: undefined;
  Ingredients: { recipe: any };
  RecipeCollection: { recipe: Recipe[]; title: any };
  DetailInquiry: undefined;
  QuestionScreen: undefined;
  ProfileScreen: undefined;
};

type TabParamList = {
  Home: undefined;
  Search: undefined;
  Bot: undefined;
  Profile: undefined;
};

type HomeStackParamList = {
  HomeScreen: undefined;
  Ingredients: { recipe: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const EmptyComponent: React.FC = () => null;

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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailInquiry"
        component={DetailInquiryScreen}
        options={{ title: "Detail Inquiry" }}
      />
      <Stack.Screen
        name="QuestionScreen"
        component={QuestionScreen}
        options={{ title: "Questions" }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const SearchStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeCollection"
        component={RecipeCollection}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator: React.FC = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = "home";
              let iconScale = focused ? 1.2 : 1; // Scale icon when focused

              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Search") {
                iconName = "search";
              } else if (route.name === "Bot") {
                iconName = "restaurant";
              } else if (route.name === "Profile") {
                iconName = "person";
              }

              return (
                <Animated.View style={{ transform: [{ scale: iconScale }] }}>
                  <Ionicons name={iconName} size={size} color={color} />
                </Animated.View>
              );
            },
            tabBarLabel: ({ focused, color }) => {
              let labelScale = focused ? 1.2 : 1; // Scale text when focused
              return (
                <Animated.Text
                  style={{
                    fontSize: focused ? 14 : 12, // Larger font when focused
                    fontWeight: focused ? "bold" : "normal", // Bold text when focused
                    color: color,
                    transform: [{ scale: labelScale }],
                  }}
                >
                  {route.name}
                </Animated.Text>
              );
            },
            tabBarStyle: {
              backgroundColor: "#F1F5F5", // Customize tab bar background color
              borderTopWidth: 1,
              borderColor: "#70b9be",
              height: 70, // Increase height for more space
              paddingBottom: 10,
            },
            tabBarIconStyle: {
              marginTop: 5, // Adjust icon positioning
            },
            tabBarActiveTintColor: "#042628", // Active tab color
            tabBarInactiveTintColor: "#70b9be", // Inactive tab color
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Search"
            component={SearchStack}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Bot"
            component={EmptyComponent}
            options={{
              title: "Bot",
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={handlePresentModalPress}
                ></TouchableOpacity>
              ),
            }}
          />
          <Tab.Screen
            name="Profile" // Add the ProfileScreen here
            component={ProfileScreen}
            options={{ headerShown: false }} // Optionally hide the header
          />
        </Tab.Navigator>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <InteractiveBottomSheet />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const linking = {
  prefixes: ["com.ritzy0717.RecipeZ://", "http://localhost:8081"],
  config: {
    screens: {
      Landing: "landing",
      Home: "home",
      DetailInquiry: "detail-inquiry",
      QuestionScreen: "questions",
    },
  },
};

const Layout: React.FC = () => (
  <NavigationContainer independent={true}>
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
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
      <Stack.Screen
        name="QuestionScreen"
        component={QuestionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Layout;
