import { Redirect } from "expo-router";

// Launch the standalone React Native experience (not the hosted website WebView).
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
