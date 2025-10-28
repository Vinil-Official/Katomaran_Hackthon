// File: app/HomeScreen.js
import JournalPage from "@/Journey/JournalPage";
import Login from "@/RegisterPoint/Login";
import Register from "@/RegisterPoint/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        // options={{ title: "Login" }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        // options={{ title: "Register" }}
      />
       <Stack.Screen
        name="JournalPage"
        component={JournalPage}
        // options={{ title: "Register" }}
      />
    </Stack.Navigator>
  );
}
