import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet,Pressable, ActivityIndicator,  } from "react-native";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { COLORS, SPACING } from "../../styles/themes"; // Ensure the path is correct

export default function SubjectScreen() {
  const { subject } = useLocalSearchParams();
  const router = useRouter();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true); // ✅ Start loading
      try {
        const subjectDocRef = doc(db, "subjects", subject);
        const subjectDocSnap = await getDoc(subjectDocRef);
        if (!subjectDocSnap.exists()) return;
        const subjectData = subjectDocSnap.data();
        const topicsData = subjectData.topics.map((topic) => ({
          id: topic,
          name: topic,
        }));
        setTopics(topicsData);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false); // ✅ Stop loading
      }
    };
    fetchTopics();
  }, [subject]);
  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} /> 
        <Text style={styles.loadingText}>Loading topics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{subject} - Topics</Text>
      {topics.length > 0 ? (
        topics.map((topic) => (
            <Pressable
            key={topic.id}
            style={({ pressed }) => [
              styles.topicButton,
              pressed && styles.buttonPressed, // ✅ Change background when pressed
            ]}
            onPress={() => router.push(`/topics/${topic.id}`)}
          >
            <Text style={styles.topicText}>{topic.name}</Text>
          </Pressable>
        ))
      ) : (
        <Text style={styles.noTopics}>No topics found for this subject.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.large,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.large,
  },
  topicButton: {
    width: "80%",
    padding: SPACING.medium,
    marginVertical: SPACING.small,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  topicText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  noTopics: {
    fontSize: 16,
    color: COLORS.mutedText,
  },
  buttonPressed: {
    backgroundColor: COLORS.secondary, // ✅ Changes color on press
    transform: [{ scale: 0.98 }], // ✅ Shrinks slightly
  },
});
