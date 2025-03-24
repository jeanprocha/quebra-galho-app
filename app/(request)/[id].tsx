import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Text, Title, Button, Divider, Card } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { requests } from '../(protected)/(home)/mockRequest';

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

export default function ServicoDetalhes() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const servico = requests.find((s) => s.id === id);
  const [mapReady, setMapReady] = useState(false);

  if (!servico) {
    return (
      <View style={styles.centered}>
        <Text>Serviço não encontrado</Text>
        <Button onPress={() => router.back()}>Voltar</Button>
      </View>
    );
  }

  const estilo = categoriaEstilos[servico.categoria] || {
    emoji: '🛠️',
    cor: '#eee',
    corTexto: '#333',
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.actions}>
          <Button mode="outlined" icon="arrow-left" onPress={() => router.back()}>
            Voltar
          </Button>
          <Button
            mode="contained"
            icon="map"
            onPress={() =>
              router.push({
                pathname: '/(map)',
                params: {
                  latitude: String(servico.latitude),
                  longitude: String(servico.longitude),
                  titulo: servico.titulo,
                  descricao: servico.descricao,
                },
              })
            }
          >
            Mapa completo
          </Button>
        </View>

        <Card mode="outlined" style={styles.card}>
          <Card.Content>
            <Title style={styles.titulo}>{servico.titulo}</Title>
            <Text style={[ styles.badgeAlt, { backgroundColor: estilo.cor, color: estilo.corTexto, } ]}>
              {`${estilo.emoji} ${servico.categoria}`}
            </Text>
            <Text style={styles.descricao}>{servico.descricao}</Text>

            {/* 👤 Solicitante */}
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>👤 Solicitante</Text>
            <Text style={styles.meta}>Nome: {servico.user}</Text>
            <Text style={styles.meta}>Bairro: {servico.location}</Text>
            <Text style={styles.meta}>Endereço: {servico.endereco}</Text>

            {/* 🔧 Serviço */}
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>🔧 Serviço</Text>
            <Text style={styles.meta}>Quando: {servico.dataHora}</Text>
            <Text style={styles.meta}>Urgência: {servico.urgencia}</Text>
            <Text style={styles.meta}>Pessoas necessárias: {servico.pessoas}</Text>

            {/* 💸 Valores */}
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>💸 Valores</Text>
            <Text style={styles.meta}>Proposta: R$ {servico.valor},00</Text>
            <Text style={styles.meta}>Dificuldade: {servico.dificuldade}</Text>

            {/* 🗒️ Extras */}
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>🗒️ Informações adicionais</Text>
            <Text style={styles.meta}>Observações: {servico.observacoes}</Text>
            <Text style={styles.meta}>Contato: {servico.contato}</Text>
          </Card.Content>
        </Card>

        <View style={styles.mapWrapper}>
          {!mapReady && (
            <View style={styles.mapLoading}>
              <ActivityIndicator size="large" color="#701ff2" />
              <Text style={{ marginTop: 8, color: '#555' }}>Carregando mapa...</Text>
            </View>
          )}
          <MapView
            style={styles.map}
            zoomEnabled={false}
            scrollEnabled={false}
            onMapReady={() => setMapReady(true)}
            region={{
              latitude: servico.latitude,
              longitude: servico.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: servico.latitude,
                longitude: servico.longitude,
              }}
              title={servico.titulo}
              description={servico.descricao}
            />
          </MapView>
        </View>
      </ScrollView>

      <Button mode="contained" style={styles.fixedButton} onPress={() => {}}>
        Responder solicitação
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 50,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
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
    marginBottom: 12,
  },
  descricao: {
    fontSize: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#444',
  },
  divider: {
    marginVertical: 12,
  },
  meta: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  mapWrapper: {
    position: 'relative',
    width: Dimensions.get('window').width - 32,
    flex: 1,
    minHeight: 140,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    alignSelf: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    zIndex: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 22,
  },
  fixedButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 8,
  },
});
