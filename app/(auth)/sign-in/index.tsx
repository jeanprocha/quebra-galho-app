// app/sign-in.tsx
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, View, Image } from 'react-native';
import { TextInput, Button, Text, Divider } from 'react-native-paper';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';

export default function SignInScreen() {
  useWarmUpBrowser();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive!({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        Alert.alert('Erro', 'Login Inválido');
      }
    } catch (err: any) {
      console.log('Erro ao fazer login:', JSON.stringify(err, null, 2));
      Alert.alert('Erro', 'Não foi possível continuar seu login');
    }
  }, [emailAddress, password]);

  const onSignInWithGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: 'com.jeanprocha.quebragalhoapp:/oauth/callback',
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
      } else {
        Alert.alert('Erro', 'Não foi possível realizar login com Google');
      }
    } catch (e) {
      console.log('Auth Error: ', e);
    }
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Image
        source={require('@/assets/images/tools.png')}
        style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 20 }}
      />
      <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: 20 }}>
        Entre com sua conta
      </Text>
      <TextInput
        label="Email"
        value={emailAddress}
        onChangeText={setEmailAddress}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 10 }}
      />
      <Button mode="contained" onPress={onSignInPress} style={{ marginBottom: 10 }}>
        Entrar
      </Button>
      <Button onPress={() => router.push('/sign-up')}>Criar nova conta</Button>
      <Divider style={{ marginVertical: 20 }} />
      <Button
        mode="outlined"
        onPress={onSignInWithGoogle}
        icon={() => (
          <Image
            source={require('@/assets/images/google.png')}
            style={{ width: 20, height: 20 }}
          />
        )}
      >
        Entrar com Google
      </Button>
    </View>
  );
}
