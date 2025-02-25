import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Card, Text, Button } from "react-native-paper"; // ✅ Material Components
import { COLORS, SPACING } from "../styles/themes";
import { FontAwesome5 } from "@expo/vector-icons";

const subjectIcons = {
  "Air Navigation": "map-marked-alt",
  "Meteorology": "cloud-sun",
  "Air Law": "balance-scale",
  "Aircraft Technical": "plane",
  "Human Performance": "heartbeat",
};

export default function HomeScreen() {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subjects"));
        const subjectsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const renderItem = ({ item }) => (
    <Card
      style={{ margin: SPACING.medium, backgroundColor: COLORS.light }}
      onPress={() => router.push(`/subjects/${item.id}`)}
    >
      <Card.Content style={{ alignItems: "center" }}>
        <FontAwesome5 name={subjectIcons[item.name] || "book"} size={40} color={COLORS.primary} />
        <Text variant="titleMedium" style={{ marginTop: SPACING.small, textAlign: "center" }}>
          {item.name}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1, padding: SPACING.large, backgroundColor: COLORS.background }}>
      <Text variant="headlineMedium" style={{ textAlign: "center", marginBottom: SPACING.large }}>
        Aviation Subjects
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
        />
      )}
    </View>
  );
}
