import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditMCQ() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanationText, setExplanationText] = useState("");
  const [explanationImage, setExplanationImage] = useState("");

  useEffect(() => {
    const fetchMCQ = async () => {
      try {
        const docRef = doc(db, "mcqs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const mcq = docSnap.data();
          setQuestion(mcq.question);
          setOptions(mcq.options);
          setCorrectAnswer(mcq.correctAnswer);
          setExplanationText(mcq.explanation?.text || "");
          setExplanationImage(mcq.explanation?.image || "");
        } else {
          Alert.alert("Error", "MCQ not found.");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching MCQ:", error);
      }
    };

    fetchMCQ();
  }, [id]);

  const handleUpdateMCQ = async () => {
    try {
      const docRef = doc(db, "mcqs", id);
      await updateDoc(docRef, {
        question,
        options,
        correctAnswer,
        explanation: explanationText || explanationImage ? { text: explanationText, image: explanationImage } : null, // Optional
      });
      Alert.alert("Success", "MCQ updated!");
      router.push("/admin/manage-mcqs");
    } catch (error) {
      console.error("Error updating MCQ:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit MCQ</Text>

      <TextInput style={styles.input} placeholder="Question" value={question} onChangeText={setQuestion} />

      {options.map((option, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Option ${index + 1}`}
          value={option}
          onChangeText={(text) => {
            const newOptions = [...options];
            newOptions[index] = text;
            setOptions(newOptions);
          }}
        />
      ))}

      <TextInput style={styles.input} placeholder="Correct Answer" value={correctAnswer} onChangeText={setCorrectAnswer} />

      <TextInput
        style={styles.input}
        placeholder="Explanation Text (Optional)"
        value={explanationText}
        onChangeText={setExplanationText}
      />

      <TextInput
        style={styles.input}
        placeholder="Explanation Image URL (Optional)"
        value={explanationImage}
        onChangeText={setExplanationImage}
      />

      <Pressable style={styles.button} onPress={handleUpdateMCQ}>
        <Text style={styles.buttonText}>Update MCQ</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { width: "100%", padding: 12, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, marginBottom: 10 },
  button: { padding: 15, backgroundColor: "#007bff", borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
