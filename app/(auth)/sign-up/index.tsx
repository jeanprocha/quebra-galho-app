import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setPendingVerification(true);
    } catch (err: any) {
      if (err.errors[0].code == 'form_identifier_exists') {
        Alert.alert('Erro', 'Usuário já existe');
      }
      if (err.errors[0].code == 'form_password_pwned') {
        Alert.alert('Erro', 'Senha não aceita, insira uma senha mais forte');
      }
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status == 'complete') {
        await setActive!({
          session: completeSignUp.createdSessionId,
        });
        router.replace('/');
      } else {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

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
      {!pendingVerification && (
        <>
          <Text
            style={{
              color: '#fff',
              marginBottom: 20,
              fontWeight: 'bold',
              fontSize: 20,
            }}
          >
            Crie uma Conta
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
            onChangeText={(email) => setEmailAddress(email)}
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
            onPress={onSignUpPress}
          >
            <Text
              style={{
                fontSize: 16,
                color: '#fff',
              }}
            >
              Cadastrar
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
              Já possui conta?
            </Text>
            <Link
              style={{
                color: '#7e40e3',
              }}
              href='/sign-in'
            >
              <Text>Entre agora</Text>
            </Link>
          </View>
        </>
      )}
      {pendingVerification && (
        <>
          <Text
            style={{
              color: '#fff',
              marginBottom: 20,
              fontWeight: 'bold',
              fontSize: 20,
            }}
          >
            Verifique Sua Conta
          </Text>
          <TextInput
            value={code}
            placeholder='Código de confirmação'
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
            onChangeText={(code) => setCode(code)}
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
            onPress={onPressVerify}
          >
            <Text
              style={{
                fontSize: 16,
                color: '#fff',
              }}
            >
              Verificar código
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
