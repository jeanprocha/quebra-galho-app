import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Text } from 'react-native-paper';

export default function FullMapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const latitude = Number(params.latitude);
  const longitude = Number(params.longitude);
  const titulo = params.titulo as string;
  const descricao = params.descricao as string;

  const isValid = !isNaN(latitude) && !isNaN(longitude);

  if (!isValid) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#701ff2" />
        <Text style={{ marginTop: 12 }}>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={{
          latitude,
          longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={titulo}
          description={descricao}
        />
      </MapView>

      <Button
        textColor="#701ff2"
        icon="arrow-left"
        mode="contained-tonal"
        onPress={() => router.back()}
        style={styles.backButton}
        contentStyle={{ flexDirection: 'row' }}
      >
        Voltar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 16,
    borderColor: '#222',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 12,
    zIndex: 10,
    backgroundColor: '#fff',
    elevation: 4,
  },
});
