import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { COLORS, SPACING } from "../../styles/themes"; // ✅ Ensure this import is correct

export default function AddTopic() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");

  const addTopicToFirestore = async () => {
    if (!subject || !topic) {
      Alert.alert("Error", "Please enter both Subject and Topic name.");
      return;
    }

    try {
      const subjectDocRef = doc(db, "subjects", subject);
      const subjectDocSnap = await getDoc(subjectDocRef);

      if (!subjectDocSnap.exists()) {
        Alert.alert("Error", "Subject does not exist in Firestore.");
        return;
      }

      const subjectData = subjectDocSnap.data();
      const updatedTopics = [...subjectData.topics, topic];

      await updateDoc(subjectDocRef, { topics: updatedTopics });

      Alert.alert("Success", `Added "${topic}" to "${subject}"`);
      setTopic(""); // Reset input field
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Topic</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Subject Name"
        value={subject}
        onChangeText={setSubject}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Topic Name"
        value={topic}
        onChangeText={setTopic}
      />

      <Pressable style={styles.button} onPress={addTopicToFirestore}>
        <Text style={styles.buttonText}>Add Topic</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.large,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: SPACING.large,
    color: COLORS.text,
  },
  input: {
    width: "80%",
    padding: SPACING.medium,
    borderColor: COLORS.mutedText,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: SPACING.medium,
    backgroundColor: COLORS.white,
  },
  button: {
    padding: SPACING.medium,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
