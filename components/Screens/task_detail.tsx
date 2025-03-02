import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

type TaskDetailsRouteProp = RouteProp<{ TaskDetails: { userId: string, taskId: string } }, "TaskDetails">;

const TaskDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<TaskDetailsRouteProp>();
  const { userId, taskId } = route.params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const fetchTaskDetails = async () => {
    try {
      const response = await fetch(`https://to-do-backend-zeta.vercel.app/task/particular-task?taskId=${taskId}`);
      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
      setPriority(data.priority);
      setStatus(data.status);
    } catch (error) {
      console.log("Error fetching task details:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTaskDetails();
    }, [])
  );

  const handleEditTask = () => {
    navigation.navigate("EditTask", { taskId: taskId });
  };

  const handleDeleteTask = async () => {
    try {
      const res = await fetch(`https://to-do-backend-zeta.vercel.app/task/delete?taskId=${taskId}`, {
        method: "DELETE",
      });

      if (!res) {
        console.log("Error in calling");
      }
      const data = await res.json();
      console.log(data);
      navigation.goBack();
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleEditTask}>
            <Icon name="edit" size={28} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="delete" size={28} color="grey" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.heading}>Title</Text>
      <View style={styles.box}>
        <Text style={styles.text}>{title || "Loading..."}</Text>
      </View>

      <Text style={styles.heading}>Description</Text>
      <View style={styles.box}>
        <Text style={styles.text}>{description || "Loading..."}</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.infoBox, styles.priorityBox]}>
          <Text>Priority</Text>
          <Text style={styles.text}>{priority || "Loading..."}</Text>
        </View>
        <View style={[styles.infoBox, styles.statusBox]}>
          <Text>Status</Text>
          <Text style={styles.text}>{status || "Loading..."}</Text>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Are you sure you want to delete this task?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleDeleteTask} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Extra padding for better scrolling
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  box: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: "#222",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoBox: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: "45%",
    alignItems: "center",
  },
  priorityBox: {
    backgroundColor: "#ffcc00",
    elevation: 5,
  },
  statusBox: {
    backgroundColor: "#ddd",
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: "blue",
  },
});

export default TaskDetails;
