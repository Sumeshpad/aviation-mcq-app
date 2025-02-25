import { PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";
import { COLORS } from "../styles/themes";

export default function Layout() {
  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }} />
    </PaperProvider>
  );
}
