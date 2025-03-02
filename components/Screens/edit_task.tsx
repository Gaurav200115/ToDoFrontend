import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

type TaskDetailsRouteProp = RouteProp<{ TaskDetails: { userId: string, taskId: string } }, "TaskDetails">;

const EditTask = () => {
  const route = useRoute<TaskDetailsRouteProp>();
  const navigation = useNavigation();
  const { taskId } = route.params;
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  const fetchTaskDetails = async () => {
    try {
      const response = await fetch(`https://to-do-backend-zeta.vercel.app/task/particular-task?taskId=${taskId}`);
      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
      setPriority(data.priority);
    } catch (error) {
      console.log("Error fetching task details:", error);
    }
  };

  const updateTask = async () => {
    try {
      const response = await fetch(`https://to-do-backend-zeta.vercel.app/task/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: taskId, title, description, priority }),
      });

      if (response.ok) {
        navigation.goBack(); // Navigate back after updating
      }
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.label}>Edit Title:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Edit Description:</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Select Priority:</Text>
        <View style={styles.priorityContainer}>
          {["Low", "Medium", "High"].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.priorityButton, priority === level && styles.selectedPriority]}
              onPress={() => setPriority(level)}
            >
              <Text style={[styles.priorityText, priority === level && styles.selectedText]}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={updateTask}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Prevents bottom content from being cut off
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "white",
    fontSize: 16,
    marginBottom: 15,
    elevation: 2,
  },
  textArea: {
    minHeight: 150, // Allows it to expand if needed
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: "white",
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 20,
    elevation: 3,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    elevation: 3,
  },
  selectedPriority: {
    backgroundColor: "#007BFF",
    elevation: 4,
  },
  priorityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedText: {
    color: "white",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 10,
    elevation: 4,
    marginBottom: 20, // Ensures it doesn't get cut off
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default EditTask;
