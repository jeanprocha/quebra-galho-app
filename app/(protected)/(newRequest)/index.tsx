import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';

export default function NewRequestScreen() {
  return (
    <View style={styles.container}>
      <Title>Novo Pedido</Title>
      <TextInput label="Categoria" mode="outlined" style={styles.input} />
      <TextInput label="Descrição" mode="outlined" multiline numberOfLines={3} style={styles.input} />
      <TextInput label="Local (bairro ou CEP)" mode="outlined" style={styles.input} />

      <Button mode="contained" onPress={() => {}} style={styles.button}>
        Publicar pedido
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  input: { marginBottom: 12 },
  button: { marginTop: 16 },
});