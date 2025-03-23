import { Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProtectedLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return (
    <Tabs>
      <Tabs.Screen name="(home)/index" options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen name="(newRequest)/index" options={{
          title: 'Novo Pedido',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen name="(profile)/index" options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
