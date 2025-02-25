import { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Button } from "react-native-paper";
import { useLocalSearchParams } from "expo-router"; // ✅ Use the selected topic
import Toast from "react-native-toast-message"; // ✅ Show success message

export default function AddMCQ() {
  const { topic } = useLocalSearchParams(); // ✅ Get the topic from URL params
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanationText, setExplanationText] = useState("");
  const [explanationImage, setExplanationImage] = useState("");

  const addMCQ = async () => {
    try {
      if (!question || !correctAnswer) {
        Toast.show({
          type: "error",
          text1: "Missing Fields",
          text2: "Please fill in all required fields!",
        });
        return;
      }

      await addDoc(collection(db, "mcqs"), {
        question,
        options,
        correctAnswer,
        explanation: { text: explanationText, image: explanationImage },
        topic, // ✅ Automatically assign the topic
      });

      Toast.show({
        type: "success",
        text1: "MCQ Added",
        text2: `Added to ${topic} successfully!`,
      });

      // ✅ Clear the form after adding MCQ
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setExplanationText("");
      setExplanationImage("");
    } catch (error) {
      console.error("Error adding MCQ:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not add the MCQ. Try again!",
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New MCQ</Text>

      <TextInput style={styles.input} placeholder="Question" value={question} onChangeText={setQuestion} />
      {options.map((option, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Option ${index + 1}`}
          value={options[index]}
          onChangeText={(text) => {
            const newOptions = [...options];
            newOptions[index] = text;
            setOptions(newOptions);
          }}
        />
      ))}

      <TextInput style={styles.input} placeholder="Correct Answer" value={correctAnswer} onChangeText={setCorrectAnswer} />
      <TextInput style={styles.input} placeholder="Explanation (optional)" value={explanationText} onChangeText={setExplanationText} />
      <TextInput style={styles.input} placeholder="Image URL (optional)" value={explanationImage} onChangeText={setExplanationImage} />

      <Button mode="contained" onPress={addMCQ} style={styles.button}>Add MCQ</Button>

      <Toast /> {/* ✅ Show confirmation messages */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F8F9FA" }, // ✅ Mild background color
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#343A40" },
  input: { borderWidth: 1, borderColor: "#DEE2E6", padding: 12, borderRadius: 8, marginBottom: 10, backgroundColor: "#FFFFFF" },
  button: { marginTop: 20, backgroundColor: "#6C757D" }, // ✅ Soft button color
});
