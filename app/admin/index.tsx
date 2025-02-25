import { View, Text, Pressable, FlatList, StyleSheet, TextInput, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { db } from "../../firebaseConfig";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { COLORS, SPACING } from "../../styles/themes";

export default function AdminHome() {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [newTopic, setNewTopic] = useState({});

  useEffect(() => {
    const fetchSubjects = async () => {
      const subjectsCollection = await getDocs(collection(db, "subjects"));
      const subjectsData = subjectsCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(subjectsData);
    };

    fetchSubjects();
  }, []);

  const addTopicToSubject = async (subjectId) => {
    const topicName = newTopic[subjectId];
    if (!topicName) {
      alert("Please enter a topic name.");
      return;
    }

    try {
      const subjectDocRef = doc(db, "subjects", subjectId);
      const subjectDocSnap = await getDoc(subjectDocRef);
      if (!subjectDocSnap.exists()) return;

      const subjectData = subjectDocSnap.data();
      const updatedTopics = subjectData.topics ? [...subjectData.topics, topicName] : [topicName];

      await updateDoc(subjectDocRef, { topics: updatedTopics });
      setNewTopic((prev) => ({ ...prev, [subjectId]: "" }));
      alert(`Added topic "${topicName}"`);
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.subjectContainer}>
            <Text style={styles.subjectTitle}>{item.name}</Text>
            {item.topics?.length ? (
              item.topics.map((topic, index) => (
                <Pressable
                  key={index}
                  style={styles.topicButton}
                  onPress={() => router.push(`/admin/manage-mcqs?topic=${topic}`)}
                >
                  <Text style={styles.topicText}>{topic}</Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.noTopics}>No topics yet.</Text>
            )}

            {/* Add New Topic */}
            <TextInput
              style={styles.input}
              placeholder="Enter New Topic"
              value={newTopic[item.id] || ""}
              onChangeText={(text) => setNewTopic((prev) => ({ ...prev, [item.id]: text }))}
            />

            <Pressable style={styles.addTopicButton} onPress={() => addTopicToSubject(item.id)}>
              <Text style={styles.buttonText}>+ Add Topic</Text>
            </Pressable>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.large, backgroundColor: COLORS.background },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: SPACING.large, color: COLORS.text, textAlign: "center" },
  subjectContainer: { marginBottom: SPACING.large, padding: SPACING.medium, backgroundColor: COLORS.white, borderRadius: 8 },
  subjectTitle: { fontSize: 22, fontWeight: "bold", marginBottom: SPACING.medium, color: COLORS.text },
  topicButton: { backgroundColor: COLORS.secondary, padding: SPACING.medium, borderRadius: 5, marginVertical: SPACING.small },
  topicText: { color: COLORS.white, fontSize: 18 },
  noTopics: { color: COLORS.mutedText, fontSize: 16 },
  input: { width: "100%", padding: SPACING.medium, borderColor: COLORS.mutedText, borderWidth: 1, borderRadius: 5, marginBottom: SPACING.medium, backgroundColor: COLORS.white },
  addTopicButton: { backgroundColor: COLORS.primary, padding: SPACING.medium, borderRadius: 8, alignItems: "center" },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: "bold" },
});
