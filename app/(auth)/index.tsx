import { Ionicons } from "@expo/vector-icons"; // Icon import
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { app } from "../../firebase.config";
import { isValidEmail } from "../utils/validation";

const Index = () => {
  const [txtEmail, setEmail] = useState("");
  const [txtPassword, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const auth = getAuth(app);

  const signIn = async () => {
    if (!isValidEmail(txtEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!txtPassword) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        txtEmail,
        txtPassword
      );
      if (result) {
        router.push("/home/find-ride");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ride hailing app!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={txtEmail}
        onChangeText={setEmail}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={txtPassword}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={signIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupContainer}
        onPress={() => router.push("/signup")}
        disabled={isLoading}
      >
        <View style={styles.signupContent}>
          <Ionicons
            name="person-add-outline"
            size={20}
            color="#0066cc"
            style={styles.icon}
          />
          <Text style={styles.signupText}>
            Don&apos;t have an account? Sign up
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    alignSelf: "center",
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "black",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signupContainer: {
    alignItems: "center",
  },
  signupContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  signupText: {
    color: "#0066cc",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
  icon: {
    marginTop: 1,
  },
});
