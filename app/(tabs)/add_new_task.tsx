import {
  DueDatePicker,
  NotesInput,
  SaveButton,
  TaskHeader,
  TaskNameInput,
} from "@/components/AddTask";
import { auth } from "@/config/firebase";
import { scheduleTaskNotification, sendNotificationToUser } from "@/config/notificationService";
import { addTask } from "@/config/taskService";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
// Task interface for type safety
interface Task {
  taskName: string;
  dueDate: Date | null;
  setReminder: boolean;
  notes: string;
}

export default function AddNewTask() {
  const router = useRouter();

  // Form state
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Validate form
  const isFormValid = (): boolean => {
    return taskName.trim().length > 0;
  };
  const handleSaveTask = async () => {
    if (!isFormValid()) {
      Alert.alert("Validation Error", "Please enter a task name.");
      return;
    }

    setLoading(true);

    try {
      if (dueDate) {
        await scheduleTaskNotification(
          "Task Reminder", // Title
          `Don't forget: ${taskName}`, // Body
          dueDate
        );
      }

      await addTask({
        taskName: taskName.trim(),
        dueDate: dueDate,
        setReminder: true,
        notes: notes.trim(),
      });

      // Send in-app notification
      if (auth.currentUser) {
        await sendNotificationToUser(auth.currentUser.uid, {
          type: "service",
          title: "New Task Scheduled",
          message: `Task '${taskName}' scheduled for ${dueDate ? dueDate.toLocaleDateString() : 'today'}`,
          icon: "calendar-outline",
          iconColor: "#0D7377",
        });
      }

      Alert.alert("Success", "Task saved successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error("Error saving task:", error);
      Alert.alert("Error", error.message || "Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <TaskHeader title="Add New Task" onBack={handleBack} />

        {/* Form Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Task Name Input */}
          <TaskNameInput
            value={taskName}
            onChangeText={setTaskName}
            placeholder="e.g. Oil Change"
          />

          {/* Due Date Picker */}
          <DueDatePicker value={dueDate} onChange={setDueDate} label="Date" />

          {/* Notes Input */}
          <NotesInput
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Use synthetic oil 5W-30..."
          />

          {/* Save Button */}
          <SaveButton
            onPress={handleSaveTask}
            loading={loading}
            disabled={!isFormValid()}
          />

          {/* Bottom Padding */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
