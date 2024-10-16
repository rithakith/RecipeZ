import { registerRootComponent } from "expo";
import React from "react";
import Layout from "./_layout";
import { AuthProvider } from "@/components/navigation/AuthContext";
import Auth from "@/components/Screens/AuthScreen";
import { NavigationContainer } from "@react-navigation/native";
const App = () => 
<AuthProvider>

<Layout />;


</AuthProvider>


export default registerRootComponent(App);
