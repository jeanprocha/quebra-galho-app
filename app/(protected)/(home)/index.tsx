import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { requests } from '../../../constants/mockRequest';

const categoriaEstilos: Record<
  string,
  { emoji: string; cor: string; corTexto?: string }
> = {
  Emprestar: { emoji: '🔧', cor: '#E0F7FA', corTexto: '#00796B' },
  Mudança: { emoji: '🚚', cor: '#FFF3E0', corTexto: '#E65100' },
  Conserto: { emoji: '🛠️', cor: '#EDE7F6', corTexto: '#5E35B1' },
  Doméstico: { emoji: '🧹', cor: '#F1F8E9', corTexto: '#33691E' },
  Solidário: { emoji: '❤️', cor: '#FCE4EC', corTexto: '#AD1457' },
  Remunerado: { emoji: '💰', cor: '#FFFDE7', corTexto: '#F9A825' },
};

const ITEMS_PER_PAGE = 10;

export default function HomeScreen() {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setVisibleCount(ITEMS_PER_PAGE);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleRefresh = () => {
    setIsLoadingMore(true);
    setVisibleCount(0); 
  
    setTimeout(() => {
      setVisibleCount(ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 1400);
  };
  
  const servicosVisiveis = requests.slice(0, visibleCount);

  const hasMore = visibleCount < requests.length;

  const handleEndReached = () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, requests.length));
      setIsLoadingMore(false);
    }, 1400);
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#701ff2" />
        <Text style={{ marginTop: 12, color: '#555' }}>Carregando serviços...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.header}>
        🛠️ Serviços na sua região
      </Text>

      <FlatList
        data={servicosVisiveis}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        renderItem={({ item }) => {
          const estilo = categoriaEstilos[item.categoria] || {
            emoji: '🛠️',
            cor: '#eee',
            corTexto: '#333',
          };

          return (
            <Card key={item.id} style={styles.card} mode="elevated">
              <Card.Content>
                <View style={styles.headerRow}>
                  <Text style={styles.titulo}>{item.titulo}</Text>
                  <Text
                    style={[
                      styles.badgeAlt,
                      {
                        backgroundColor: estilo.cor,
                        color: estilo.corTexto,
                      },
                    ]}
                  >
                    {`${estilo.emoji} ${item.categoria}`}
                  </Text>
                </View>
                <Text style={styles.descricao}>{item.descricao}</Text>
                <Text style={styles.meta}>👤 {item.user}</Text>
                <Text style={styles.meta}>📍 {item.location}</Text>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button
                  mode="contained"
                  onPress={() =>
                    router.push({
                      pathname: '/(request)/[id]',
                      params: { id: item.id },
                    })
                  }
                >
                  Ver detalhes
                </Button>
              </Card.Actions>
            </Card>
          );
        }}
        ListFooterComponent={
          !hasMore ? (
            <Text style={styles.endMessage}>Você já viu todos os serviços 😉</Text>
          ) : isLoadingMore ? (
            <ActivityIndicator style={{ marginTop: 80 }} color="#701ff2" />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    marginBottom: 24,
    fontWeight: 'bold',
    color: '#701ff2',
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 8,
    color: '#222',
  },
  badgeAlt: {
    alignSelf: 'flex-start',
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    fontWeight: '500',
  },
  descricao: {
    fontSize: 16,
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingRight: 12,
    paddingBottom: 12,
  },
  endMessage: {
    textAlign: 'center',
    color: '#777',
    paddingVertical: 16,
    fontStyle: 'italic',
  },
});
