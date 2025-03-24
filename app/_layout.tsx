import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { DefaultTheme } from 'react-native-paper';

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};

const publicKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#701ff2',
    background: '#f2f2f2',
    text: '#222',
  },
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publicKey} tokenCache={tokenCache}>
      <PaperProvider theme={theme}>
        <StatusBar backgroundColor="#222" barStyle="light-content" />
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </ClerkProvider>
  );
}
