import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

const Logout = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [userData, setUserData] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await fetch("https://to-do-backend-zeta.vercel.app/user/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Fetched Data:", data);

      if (response.ok) {
        setUserData({ name: data.fullname, email: data.email });
      } else {
        console.log("Invalid user data response:", data);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      Alert.alert("Logout failed", "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information</Text>

      <Text style={styles.label}>Name</Text>
      <View style={styles.infoBox}>
        <Text style={styles.value}>{userData.name || "Loading..."}</Text>
      </View>

      <Text style={styles.label}>Email</Text>
      <View style={styles.infoBox}>
        <Text style={styles.value}>{userData.email || "Loading..."}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Glassy Effect Box */}
      <View style={styles.glassBox}>
        <Text style={styles.glassText}>Hope to see you soon.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginBottom: 6,
  },
  infoBox: {
    width: "90%",
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  value: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 8,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logoutText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  glassBox: {
    marginTop: 40,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "rgba(24, 22, 22, 0.12)",
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  glassText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
});

export default Logout;
