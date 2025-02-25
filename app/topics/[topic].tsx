import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { db } from "../../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { COLORS, SPACING } from "../../styles/themes";

export default function TopicScreen() {
  const { topic } = useLocalSearchParams();
  const [mcqs, setMcqs] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const mcqsRef = collection(db, "mcqs");
    const q = query(mcqsRef, where("topic", "==", topic));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mcqsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMcqs(mcqsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [topic]);

  const submitAnswers = () => {
    setSubmitted(true);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <ScrollView>
          <Text style={styles.title}>{topic} - MCQs</Text>

          {mcqs.map((mcq) => (
            <View key={mcq.id} style={styles.card}>
              <Text style={styles.question}>{mcq.question}</Text>

              {mcq.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    selectedAnswers[mcq.id] === option && styles.selectedOption,
                    submitted && selectedAnswers[mcq.id] === option && (mcq.correctAnswer === option ? styles.correctOption : styles.wrongOption),
                  ]}
                  onPress={() =>
                    !submitted &&
                    setSelectedAnswers((prev) => ({ ...prev, [mcq.id]: option }))
                  }
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}

              {submitted && mcq.explanation && (
                <View style={styles.explanationContainer}>
                  <Text>{mcq.explanation.text}</Text>
                  {mcq.explanation.image && (
                    <TouchableOpacity onPress={() => setModalImage(mcq.explanation.image)}>
                      <Image source={{ uri: mcq.explanation.image }} style={styles.explanationImage} />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.submitButton} onPress={submitAnswers} disabled={submitted}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {modalImage && (
        <Modal visible={true} transparent={true} onRequestClose={() => setModalImage(null)}>
          <View style={styles.modalBackground}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalImage(null)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Image source={{ uri: modalImage }} style={styles.fullScreenImage} resizeMode="contain" />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.large, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: "bold", color: COLORS.text, textAlign: "center", marginBottom: SPACING.large },
  card: { backgroundColor: COLORS.light, padding: SPACING.large, borderRadius: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, marginBottom: SPACING.large, elevation: 4 },
  question: { fontSize: 18, fontWeight: "bold", color: COLORS.text, marginBottom: SPACING.small },
  option: { padding: SPACING.medium, borderRadius: 12, backgroundColor: COLORS.background, marginTop: SPACING.small, borderWidth: 1, borderColor: COLORS.primary },
  optionText: { fontSize: 16, color: COLORS.text },
  selectedOption: { backgroundColor: "#ADD8E6" },
  correctOption: { backgroundColor: "green" },
  wrongOption: { backgroundColor: "red" },
  submitButton: { marginTop: SPACING.large, padding: SPACING.medium, backgroundColor: COLORS.success, borderRadius: 12, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
  submitText: { color: COLORS.light, fontSize: 18, fontWeight: "bold" },
  explanationContainer: { marginTop: 10, padding: 10, backgroundColor: "#f8f9fa", borderRadius: 5 },
  explanationText: { fontSize: 16, color: COLORS.text },
  explanationImage: { width: 200, height: 100, marginTop: 5, borderRadius: 5 },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  fullScreenImage: { width: "90%", height: "80%" },
  closeButton: { position: "absolute", top: 50, right: 20, backgroundColor: "white", padding: 10, borderRadius: 5 },
  closeText: { fontSize: 20, fontWeight: "bold" },
});
