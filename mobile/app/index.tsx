import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { WebView, type WebViewNavigation } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { BrandMark } from "../components/Brand";

const SITE_URL = (process.env.EXPO_PUBLIC_SITE_URL || "https://yosha-store.onrender.com").replace(/\/$/, "");
const SITE_HOST = new URL(SITE_URL).host;

export default function Index() {
  const web = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleNavigation = useCallback((request: WebViewNavigation) => {
    let target: URL;
    try { target = new URL(request.url); } catch { return false; }
    if (target.protocol === "about:" || target.host === SITE_HOST || target.host.endsWith(".onrender.com") || target.host === "xcgxenmvkabvcsikcasy.supabase.co") return true;
    if (["tel:", "mailto:", "whatsapp:"].includes(target.protocol)) {
      Linking.openURL(request.url).catch(() => undefined);
      return false;
    }
    if (target.protocol === "https:" || target.protocol === "http:") {
      Linking.openURL(request.url).catch(() => undefined);
      return false;
    }
    return false;
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBack) { web.current?.goBack(); return true; }
      return false;
    });
    return () => subscription.remove();
  }, [canGoBack]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" backgroundColor="#F4FBF5" />
      <WebView
        ref={web}
        source={{ uri: SITE_URL }}
        style={styles.web}
        originWhitelist={["https://*", "http://*"]}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        allowsBackForwardNavigationGestures
        setSupportMultipleWindows={false}
        javaScriptCanOpenWindowsAutomatically={false}
        geolocationEnabled
        startInLoadingState={false}
        onLoadStart={() => { setLoading(true); setFailed(false); }}
        onLoadEnd={() => setLoading(false)}
        onError={() => { setLoading(false); setFailed(true); }}
        onHttpError={(event) => {
          if (event.nativeEvent.statusCode >= 500) { setLoading(false); setFailed(true); }
        }}
        onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
        onShouldStartLoadWithRequest={handleNavigation}
        pullToRefreshEnabled={Platform.OS === "android"}
        cacheEnabled
        applicationNameForUserAgent="YOSHA-STORE-Android"
      />
      {loading && !failed ? (
        <View style={styles.loading}>
          <View style={styles.logo}><BrandMark size={62}/></View>
          <ActivityIndicator size="large" color="#17643A" />
          <Text style={styles.loadingText}>جارٍ فتح متجر يوشا...</Text>
        </View>
      ) : null}
      {failed ? (
        <View style={styles.error}>
          <View style={styles.logo}><Text style={styles.logoText}>Y</Text></View>
          <Ionicons name="cloud-offline-outline" size={42} color="#17643A" />
          <Text style={styles.errorTitle}>تعذر الاتصال بمتجر YOSHA</Text>
          <Text style={styles.errorCopy}>تحقق من اتصال الإنترنت ثم أعد المحاولة.</Text>
          <Pressable style={styles.retry} onPress={() => { setFailed(false); setLoading(true); web.current?.reload(); }}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4FBF5" },
  web: { flex: 1, backgroundColor: "#F4FBF5" },
  loading: { ...StyleSheet.absoluteFillObject, backgroundColor: "#F4FBF5", alignItems: "center", justifyContent: "center", gap: 14 },
  logo: { width: 82, height: 82, borderRadius: 27, backgroundColor: "#E4F3E8", borderWidth: 1, borderColor: "#CDE5D3", alignItems: "center", justifyContent: "center" },
  loadingText: { color: "#28583A", fontSize: 13, fontWeight: "700" },
  error: { ...StyleSheet.absoluteFillObject, backgroundColor: "#F4FBF5", alignItems: "center", justifyContent: "center", padding: 28, gap: 14 },
  errorTitle: { color: "#103C25", fontSize: 20, fontWeight: "900", textAlign: "center" },
  errorCopy: { color: "#6D7F72", fontSize: 13, textAlign: "center", lineHeight: 21 },
  retry: { backgroundColor: "#17643A", borderRadius: 14, paddingHorizontal: 22, paddingVertical: 13, flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  retryText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 }
});
