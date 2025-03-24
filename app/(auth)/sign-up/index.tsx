// app/sign-up.tsx
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Image, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({ emailAddress, password });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setPendingVerification(true);
    } catch (err: any) {
      const code = err?.errors?.[0]?.code;
      if (code === 'form_identifier_exists') {
        Alert.alert('Erro', 'Usuário já existe');
      } else if (code === 'form_password_pwned') {
        Alert.alert('Erro', 'Senha fraca, use uma mais forte');
      } else {
        Alert.alert('Erro', 'Não foi possível criar sua conta');
      }
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

      if (completeSignUp.status === 'complete') {
        await setActive!({ session: completeSignUp.createdSessionId });
        router.replace('/');
      } else {
        console.log('Verificação incompleta:', completeSignUp.status);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Erro', 'Código inválido ou expirado');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Image
        source={require('@/assets/images/tools.png')}
        style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 20 }}
      />
      {!pendingVerification ? (
        <>
          <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: 20 }}>
            Crie sua conta
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
          <Button mode="contained" onPress={onSignUpPress} style={{ marginBottom: 10 }}>
            Cadastrar
          </Button>
          <Button onPress={() => router.push('/sign-in')}>Já possui conta? Entrar</Button>
        </>
      ) : (
        <>
          <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: 20 }}>
            Verifique seu email
          </Text>
          <TextInput
            label="Código de verificação"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={{ marginBottom: 10 }}
          />
          <Button mode="contained" onPress={onPressVerify}>
            Verificar código
          </Button>
        </>
      )}
    </View>
  );
}
