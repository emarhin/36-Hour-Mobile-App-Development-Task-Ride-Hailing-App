import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="find-ride" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
