import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';

export default function NewRequestScreen() {
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!categoria || !descricao || !local) return;

    // Simula envio
    console.log('Novo pedido:', { categoria, descricao, local });
    setSuccess(true);
    setCategoria('');
    setDescricao('');
    setLocal('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text variant="headlineMedium" style={styles.title}>
        Novo Pedido
      </Text>

      <TextInput
        label="Categoria"
        mode="outlined"
        value={categoria}
        onChangeText={setCategoria}
        style={styles.input}
      />
      <TextInput
        label="Descrição"
        mode="outlined"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
        style={[styles.input, { height: 100 }]}
      />
      <TextInput
        label="Local (bairro ou CEP)"
        mode="outlined"
        value={local}
        onChangeText={setLocal}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        disabled={!categoria || !descricao || !local}
      >
        Publicar pedido
      </Button>

      <Snackbar
        visible={success}
        onDismiss={() => setSuccess(false)}
        duration={3000}
      >
        Pedido publicado com sucesso!
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  title: { marginBottom: 20 },
  input: { marginBottom: 12 },
  button: { marginTop: 16 },
});
