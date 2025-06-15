import { useAuth } from "@/context/authContext";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or render a Splash screen
  }

  if (user) {
    return <Redirect href="/home/find-ride" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "signIn" }} />
      <Stack.Screen name="signup" options={{ title: "signup" }} />
    </Stack>
  );
}
