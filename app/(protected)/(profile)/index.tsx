import React, { useState } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Avatar,
  Title,
  Text,
  TextInput,
  Button,
  List,
  Divider,
  HelperText,
  Menu,
} from 'react-native-paper';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
  const [description, setDescription] = useState('Sou um vizinho disposto a ajudar!');
  const [distance, setDistance] = useState('5');
  const [photo, setPhoto] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  const distanceOptions = [
    { label: 'Até 2 km', value: '2' },
    { label: 'Até 5 km', value: '5' },
    { label: 'Até 10 km', value: '10' },
    { label: 'Até 20 km', value: '20' },
  ];

  const allRatings = [
    { id: '1', user: 'Maria', comment: 'Super prestativo!', rating: 5 },
    { id: '2', user: 'Carlos', comment: 'Resolveu rápido meu problema', rating: 4 },
    { id: '3', user: 'Fernanda', comment: 'Educado e eficiente!', rating: 5 },
    { id: '4', user: 'João', comment: 'Muito atencioso, recomendo!', rating: 5 },
    { id: '5', user: 'Ana', comment: 'Trabalho excelente!', rating: 5 },
    { id: '6', user: 'Lúcia', comment: 'Sempre disponível!', rating: 4 },
    { id: '7', user: 'Pedro', comment: 'Recomendo muito!', rating: 5 },
    { id: '8', user: 'Bruna', comment: 'Ajudou com a mudança!', rating: 5 },
    { id: '9', user: 'Caio', comment: 'Rápido e eficiente!', rating: 5 },
    { id: '10', user: 'Paula', comment: 'Muito gentil!', rating: 5 },
    { id: '11', user: 'Edu', comment: 'Atencioso e pontual', rating: 4 },
    { id: '12', user: 'Juliana', comment: 'Maravilhoso!', rating: 5 },
  ];

  const [visibleCount, setVisibleCount] = useState(5);

  useFocusEffect(
    React.useCallback(() => {
      setVisibleCount(5);
    }, [])
  );
  
  const visibleRatings = allRatings.slice(0, visibleCount);
  const hasMore = visibleCount < allRatings.length;

  const handleChangePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Você precisa permitir acesso à galeria.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: false,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setPhoto(selectedImage.uri);
    }
  };

  const handleSave = () => {
    console.log('Salvar alterações:', { description, distance });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
    >
      <View style={styles.center}>
        <Avatar.Image
          size={100}
          source={ photo ? { uri: photo } : user?.imageUrl ? { uri: user.imageUrl } : require('../../../assets/profile.png') }
          style={{ marginBottom: 12 }}
        />
        <Button onPress={handleChangePhoto} mode="outlined" compact>
          Alterar foto
        </Button>

        <Title style={{ marginTop: 16 }}>
          <List.Icon icon="account-circle" /> Seu Perfil
        </Title>
        {user && (
          <>
            <Text style={styles.userText}>{user.fullName}</Text>
            <Text style={styles.userEmail}>{user.primaryEmailAddress?.emailAddress}</Text>
          </>
        )}
      </View>

      <TextInput
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        style={styles.input}
      />

      <Text style={{ marginTop: 16 }}>Distância de atendimento:</Text>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={{ marginVertical: 8 }}
          >
            {distanceOptions.find((opt) => opt.value === distance)?.label || 'Escolher distância'}
          </Button>
        }
      >
        {distanceOptions.map((opt) => (
          <Menu.Item
            key={opt.value}
            onPress={() => {
              setDistance(opt.value);
              setMenuVisible(false);
            }}
            title={opt.label}
          />
        ))}
      </Menu>
      <HelperText type="info">Você verá e receberá pedidos até essa distância.</HelperText>

      <Button mode="contained" onPress={handleSave} style={{ marginVertical: 20 }}>
        Salvar alterações
      </Button>

      <Divider style={{ marginBottom: 12 }} />
      <Title style={{ marginBottom: 8 }}>Avaliações Recebidas</Title>

      <List.Section >
        {visibleRatings.map((item) => (
          <List.Item
            key={item.id}
            title={`${item.user} (${item.rating} ⭐)`}
            description={item.comment}
            left={() => <List.Icon icon="account" />}
          />
        ))}
      </List.Section>
      
      {hasMore && (
        <Button
          mode="text"
          onPress={() => setVisibleCount((prev) => prev + 10)}
          style={{ marginBottom: 20 }}
        >
          Carregar mais...
        </Button>
      )}

      <Divider style={{ marginVertical: 16 }} />
      <Button
        onPress={() =>
          signOut({ redirectUrl: '/(auth)/sign-in' })
        }
        mode="outlined"
      >
        Sair da conta
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  center: { alignItems: 'center' },
  input: { marginTop: 8 },
  userText: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  userEmail: { fontSize: 14, color: '#777' },
});
