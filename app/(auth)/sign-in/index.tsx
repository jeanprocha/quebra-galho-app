import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { Link, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';

export default function Page() {
  useWarmUpBrowser();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startOAuthFlow } = useOAuth({
    strategy: 'oauth_google',
  });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status == 'complete') {
        await setActive!({
          session: signInAttempt.createdSessionId,
        });
        router.replace('/');
      } else {
        Alert.alert('Erro', 'Login Inválido');
      }
    } catch (err: any) {
      Alert.alert(
        'Erro',
        'Não foi possível continuar seu login, algo de errado aconteceu!'
      );
    }
  }, [emailAddress, password]);

  const onSignInWithGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/', { scheme: 'myapp' }),
      });
      if (createdSessionId) {
        await setActive!({
          session: createdSessionId,
        });
      } else {
        Alert.alert('Erro', 'Não foi possível realizar login com Google');
      }
    } catch (e) {
      console.log('Auth Error: ', e);
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
      }}
    >
      <Image
        source={require('@/assets/images/musical.png')}
        defaultSource={require('@/assets/images/musical.png')}
        style={{
          width: 100,
          height: 100,
          marginBottom: 10,
        }}
      />
      <Text
        style={{
          color: '#fff',
          marginBottom: 20,
          fontWeight: 'bold',
          fontSize: 20,
        }}
      >
        Entre Com Sua Conta
      </Text>
      <TextInput
        autoCapitalize='none'
        value={emailAddress}
        placeholder='Seu Email'
        placeholderTextColor={'#ddd'}
        style={{
          borderWidth: 1,
          borderColor: '#eee',
          width: 300,
          height: 40,
          borderRadius: 10,
          paddingLeft: 8,
        }}
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        placeholder='Sua Senha'
        placeholderTextColor={'#ddd'}
        style={{
          borderWidth: 1,
          borderColor: '#eee',
          width: 300,
          height: 40,
          borderRadius: 10,
          paddingLeft: 8,
          marginTop: 20,
        }}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity
        style={{
          backgroundColor: '#701ff2',
          width: 200,
          height: 40,
          marginTop: 10,
          borderRadius: 10,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onSignInPress}
      >
        <Text
          style={{
            fontSize: 16,
            color: '#fff',
          }}
        >
          Entrar
        </Text>
      </TouchableOpacity>
      <View
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            color: '#eee',
          }}
        >
          Não possui conta?
        </Text>
        <Link
          style={{
            color: '#7e40e3',
          }}
          href='/sign-up'
        >
          <Text>Criar agora</Text>
        </Link>
      </View>
      <View
        style={{
          width: '90%',
          height: 1,
          backgroundColor: '#5c5c5c',
          marginVertical: 8,
        }}
      />
      <View
        style={{
          marginTop: 10,
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            width: 160,
            height: 50,
            borderRadius: 80,
          }}
          activeOpacity={0.7}
          onPress={onSignInWithGoogle}
        >
          <Image
            source={require('@/assets/images/google.png')}
            defaultSource={require('@/assets/images/google.png')}
            style={{
              width: 32,
              height: 32,
            }}
          />
          <Text
            style={{
              marginLeft: 10,
              fontSize: 17,
            }}
          >
            Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
