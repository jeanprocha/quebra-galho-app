import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
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
import { useClerk } from '@clerk/clerk-expo';

export default function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  const [description, setDescription] = useState('Sou um vizinho disposto a ajudar!');
  const [distance, setDistance] = useState('5');
  const [photo, setPhoto] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const { signOut } = useClerk();

  const distanceOptions = [
    { label: 'Até 2 km', value: '2' },
    { label: 'Até 5 km', value: '5' },
    { label: 'Até 10 km', value: '10' },
    { label: 'Até 20 km', value: '20' },
  ];

  const ratings = [
    { id: '1', user: 'Maria', comment: 'Super prestativo!', rating: 5 },
    { id: '2', user: 'Carlos', comment: 'Resolveu rápido meu problema', rating: 4 },
    { id: '3', user: 'Fernanda', comment: 'Educado e eficiente!', rating: 5 },
    { id: '4', user: 'João', comment: 'Muito atencioso, recomendo!', rating: 5 },
    { id: '5', user: 'Ana', comment: 'Trabalho excelente!', rating: 5 },
  ];

  const handleChangePhoto = () => {
    // setPhoto('https://ui-avatars.com/api/?name=Vizinho');
    console.log('handleChangePhoto');
  };

  const handleSave = () => {
    console.log('Salvar alterações:', { description, distance });
  };

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={100}
        source={
          photo
            ? { uri: photo }
            : require('../../../assets/profile.png')
        }
        style={{ marginBottom: 12 }}
      />
      <Button onPress={handleChangePhoto} mode="outlined" compact>
        Alterar foto
      </Button>

      <Title style={{ marginTop: 16 }}>Seu Perfil</Title>

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

      <Button mode="contained" onPress={handleSave} style={{ marginVertical: 20 }}>
        Salvar alterações
      </Button>

      <Divider style={{ marginBottom: 12 }} />
      <Title style={{ marginBottom: 8 }}>Avaliações Recebidas</Title>

      <FlatList
        data={ratings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <List.Item
            title={`${item.user} (${item.rating} ⭐)`}
            description={item.comment}
            left={() => <List.Icon icon="account" />}
          />
        )}
      />

      <Divider style={{ marginVertical: 16 }} />
      <Button onPress={() => signOut({redirectUrl: '/(auth)/sign-in',})} mode="outlined">
        Sair da conta
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  input: { marginTop: 8 },
});