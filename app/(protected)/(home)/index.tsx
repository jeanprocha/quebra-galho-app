import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Title, Paragraph } from 'react-native-paper';

export default function HomeScreen() {
  const pedidos = [
    { id: '1', categoria: 'Emprestar', titulo: 'Preciso de uma furadeira', descricao: 'Se alguém puder emprestar até amanhã.' },
    { id: '2', categoria: 'Mudança', titulo: 'Ajuda com sofá', descricao: 'Preciso de ajuda pra carregar um sofá hoje à tarde.' },
  ];

  return (
    <View style={styles.container}>
      <Title style={styles.header}>Pedidos no seu bairro</Title>

      {pedidos.map((item) => (
        <Card key={item.id} style={styles.card}>
          <Card.Title title={item.titulo} subtitle={item.categoria} />
          <Card.Content>
            <Paragraph>{item.descricao}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => {}}>Ajudar</Button>
          </Card.Actions>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  header: { marginBottom: 16 },
  card: { marginBottom: 16 },
});