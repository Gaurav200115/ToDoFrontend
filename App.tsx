import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./components/Auth/login";
import Register from "./components/Auth/register";
import TaskDetails from "./components/Screens/task_detail";
import AddTask from "./components/Screens/add_task";
import { Splash } from "./components/Screens/splash";
import Logout from "./components/Auth/logout";
import Main from "./components/Screens/main";
import EditTask from "./components/Screens/edit_task";

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log("Checking AsyncStorage...");
      const token = await AsyncStorage.getItem("token");
      console.log("1")
      if (!token || token === "null") {  // Null check added
        console.log("No valid token found.");
        setIsLoggedIn(false);
        return;
      }
  
      console.log("Retrieved Token:", token);
      const res = await fetch("https://to-do-backend-zeta.vercel.app/user/check", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (res.ok) {
        console.log("Token is valid.");
        setIsLoggedIn(true);
      } else {
        console.log("Invalid token, logging out...");
        setIsLoggedIn(false);
        await AsyncStorage.removeItem("token"); // Clear invalid token
      }
    } catch (error) {
      console.error("Error in checkAuth:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };
  



  if (loading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
          </>
        )}
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} options={{ headerShown: false }} />
        <Stack.Screen name="AddTask" component={AddTask} options={{ headerShown: false }} />
        <Stack.Screen name="EditTask" component={EditTask} options={{ headerShown: false }} />
        <Stack.Screen name="Logout" component={Logout} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
