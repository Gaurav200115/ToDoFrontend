import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
import { NavigationProp, ParamListBase, useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Main = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchUserTasks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await fetch("https://to-do-backend-zeta.vercel.app/task/my-task", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTasks(data);
      } else {
        console.log("Error fetching tasks:", data.message);
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserTasks();
    }, [])
  );

  const toggleTaskCompletion = async (_id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token not found");
        return;
      }

      const response = await fetch(`https://to-do-backend-zeta.vercel.app/task/update`, {
        method: "PATCH",            
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id, status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log("Update Failed:", data);
        return;
      }

      fetchUserTasks(); // Refresh the task list after updating
    } catch (error) {
      console.log("Error updating task status:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Task</Text>
        <TouchableOpacity style={styles.logoutIcon} onPress={() => navigation.navigate("Logout")}>
          <Icon name="sign-out" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={require("../Assets/lets_start.jpg")} style={styles.emptyImage} />
          <Text style={styles.emptyText}>No tasks added yet.</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.taskItem, item.status === "completed" && styles.completedTask]}
              onPress={() => navigation.navigate("TaskDetails", { taskId: item._id })}
            >
              <Text style={styles.taskText}>{item.title}</Text>
              <TouchableOpacity onPress={() => toggleTaskCompletion(item._id, item.status)}>
                <Icon
                  name={item.status === "completed" ? "check-circle" : "circle-o"}
                  size={24}
                  color={item.status === "completed" ? "green" : "gray"}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddTask")}>
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topBar: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: height * 0.035,
    marginHorizontal: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    alignContent: "center",
    alignItems: "center",
    elevation: 8, // Increased elevation
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  logoutIcon: {
    position: "absolute",
    right: 15,
    top: "50%",
  },
  taskItem: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 10, // Increased elevation
  },
  completedTask: {
    backgroundColor: "#c8f7c5", // Light green when task is completed
  },
  taskText: {
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#007BFF",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Increased elevation
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: width,
    height: height*.3,
    resizeMode: "contain",
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
    marginTop: 10,
  },
});

export default Main;
