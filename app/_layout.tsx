import React, { useCallback, useMemo, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  // BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
// import BottomSheet from "@gorhom/bottom-sheet";
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
  Home: undefined;
  Ingredients: { recipe: any };
  RecipeCollection: { recipe: Recipe[]; title: any };
  DetailInquiry: undefined;
  QuestionScreen: undefined;
  ProfileScreen:undefined;
};

type TabParamList = {
  Home: undefined;
  Search: undefined;
  Bot: undefined;
};

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
      <Stack.Screen
        name="RecipeCollection"
        component={RecipeCollection}
        options={{ title: "Recipe filters" }}
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
            tabBarIcon: ({ color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = "home";
              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Search") {
                iconName = "search";
              } else if (route.name === "Profile") {
                iconName = "person"; // Choose an icon for Profile
              } else {
                iconName = "restaurant";
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
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Bot"
            component={() => null}
            options={{
              title: "Bot",
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={handlePresentModalPress}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="restaurant" size={24} color="gray" />
                </TouchableOpacity>
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
  prefixes: ["myapp://", "http://localhost:8081"],
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
