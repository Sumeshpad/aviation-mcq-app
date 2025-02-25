import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { COLORS, SPACING } from "../../styles/themes";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin"); // ✅ Redirect to Admin Panel after login
    } catch (error) {
      Alert.alert("Login Failed", error.message);
      router.replace("/"); // ✅ Redirect to Home Page on failure
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.large, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: SPACING.large, color: COLORS.text },
  input: { width: "80%", padding: SPACING.medium, borderColor: COLORS.mutedText, borderWidth: 1, borderRadius: 5, marginBottom: SPACING.medium, backgroundColor: COLORS.white },
  button: { padding: SPACING.medium, backgroundColor: COLORS.primary, borderRadius: 8, alignItems: "center" },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: "bold" },
});
