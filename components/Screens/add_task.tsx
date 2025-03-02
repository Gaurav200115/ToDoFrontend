import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium"); // Default Priority
  const todayDate = new Date().toLocaleDateString();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  
  const postTask = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found, user not authenticated");
        return;
      }

      console.log(token)
      const res = await fetch('https://to-do-backend-zeta.vercel.app/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send only the token
        },
        body: JSON.stringify({
          title: title,
          description: description,
          priority: priority,
          createdAt: String(todayDate)
        })
      });
      console.log("1")
      const data = await res.json();
      console.log("Response:", data);
      navigation.goBack();
      
    } catch (err) {
      console.log("Error posting task:", err);
    }
  };
  

  const handleAddTask = () => {
    if (title.trim() === "" || description.trim() === "") {
      return;
    }
    postTask()
    console.log("New Task:", { title, description, priority, date: todayDate });
  };

  return (
    <View style={styles.container}>
      {/* Display Today's Date */}
      <Text style={styles.dateText}>{todayDate}</Text>

      {/* Title Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description Input */}
      <TextInput
        style={styles.textArea}
        placeholder="Enter task description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Priority Selection */}
      <Text style={styles.label}>Select Priority:</Text>
      <View style={styles.priorityContainer}>
        {["Low", "Medium", "High"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.priorityButton, priority === level && styles.selectedPriority]}
            onPress={() => setPriority(level)}
          >
            <Text style={[styles.priorityText, priority === level && styles.selectedText]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "white",
    fontSize: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "white",
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#ddd",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  selectedPriority: {
    backgroundColor: "#007BFF",
  },
  priorityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedText: {
    color: "white",
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default AddTask;
