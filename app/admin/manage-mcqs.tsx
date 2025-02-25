import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable, FlatList, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { COLORS, SPACING } from "../../styles/themes";

export default function ManageMCQs() {
  const { topic } = useLocalSearchParams();
  const router = useRouter();
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMCQs = async () => {
      try {
        const mcqsRef = collection(db, "mcqs");
        const q = query(mcqsRef, where("topic", "==", topic));
        const querySnapshot = await getDocs(q);
        const mcqsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMcqs(mcqsData);
      } catch (error) {
        console.error("Error fetching MCQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMCQs();
  }, [topic]);

  const deleteMCQ = async (id) => {
    try {
      await deleteDoc(doc(db, "mcqs", id));
      setMcqs(mcqs.filter((mcq) => mcq.id !== id));
      Alert.alert("Success", "MCQ deleted successfully.");
    } catch (error) {
      console.error("Error deleting MCQ:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{topic} - Manage MCQs</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={mcqs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.mcqContainer}>
              <Text style={styles.question}>{item.question}</Text>

              <Pressable style={styles.editButton} onPress={() => router.push(`/admin/edit-mcq?id=${item.id}`)}>
                <Text style={styles.buttonText}>Edit</Text>
              </Pressable>

              <Pressable style={styles.deleteButton} onPress={() => deleteMCQ(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          )}
        />
      )}

      <Pressable style={styles.button} onPress={() => router.push(`/admin/add-mcq?topic=${topic}`)}>
        <Text style={styles.buttonText}>+ Add New MCQ</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.large, backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: SPACING.large, color: COLORS.text },
  mcqContainer: { backgroundColor: COLORS.white, padding: SPACING.medium, borderRadius: 5, marginVertical: SPACING.small },
  question: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  editButton: { backgroundColor: "blue", padding: SPACING.medium, borderRadius: 5, marginTop: SPACING.small },
  deleteButton: { backgroundColor: "red", padding: SPACING.medium, borderRadius: 5, marginTop: SPACING.small },
  button: { width: "80%", padding: SPACING.medium, backgroundColor: COLORS.primary, borderRadius: 8, alignItems: "center", marginTop: SPACING.large },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: "bold" },
});
