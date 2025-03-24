import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Snackbar,
  HelperText,
  Menu,
  Divider,
} from 'react-native-paper';
import * as Location from 'expo-location';

export default function NewRequestScreen() {
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [urgencia, setUrgencia] = useState('');
  const [contato, setContato] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [success, setSuccess] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const categorias = ['Emprestar', 'Mudança', 'Conserto', 'Doméstico', 'Solidário', 'Remunerado'];
  const categoriaEstilos: Record<string, { emoji: string }> = {
    Emprestar: { emoji: '🔧' },
    Mudança: { emoji: '🚚' },
    Conserto: { emoji: '🛠️' },
    Doméstico: { emoji: '🧹' },
    Solidário: { emoji: '❤️' },
    Remunerado: { emoji: '💰' },
  };

  const handleSubmit = () => {
    if (!categoria || !descricao || !endereco) return;

    console.log('Novo pedido:', {
      categoria,
      descricao,
      endereco,
      numero,
      complemento,
      dataHora,
      urgencia,
      contato,
      observacoes,
    });

    setSuccess(true);
    setCategoria('');
    setDescricao('');
    setEndereco('');
    setNumero('');
    setComplemento('');
    setDataHora('');
    setUrgencia('');
    setContato('');
    setObservacoes('');
  };

  const obterLocalizacao = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoadingLocation(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      const coords = pos.coords;

      const geo = await Location.reverseGeocodeAsync(coords);
      const data = geo[0];

      const rua = data.street || '';
      const bairro = (data as any).suburb || data.district || '';
      const cidade = data.city || '';
      const uf = data.region || '';

      const enderecoFormatado = [rua, bairro, cidade, uf].filter(Boolean).join(' - ');
      setEndereco(enderecoFormatado);

      setLoadingLocation(false);
    } catch (err) {
      console.log('Erro ao obter localização:', err);
      setLoadingLocation(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 64}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text variant="headlineLarge" style={styles.title}>
            ✏️ Novo Pedido de Serviço
          </Text>

          {/* Categoria */}
          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>📋 Categoria</Text>

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableWithoutFeedback onPress={() => setMenuVisible(true)}>
                <View pointerEvents="box-only">
                  <TextInput
                    mode="outlined"
                    label="Categoria*"
                    value={
                      categoria
                        ? `${categoriaEstilos[categoria]?.emoji || ''} ${categoria}`
                        : ''
                    }
                    style={styles.input}
                    editable={false}
                    right={<TextInput.Icon icon="menu-down" />}
                  />
                </View>
              </TouchableWithoutFeedback>
            }
          >
            {categorias.map((item) => (
              <Menu.Item
                key={item}
                onPress={() => {
                  setCategoria(item);
                  setMenuVisible(false);
                }}
                title={`${categoriaEstilos[item]?.emoji || ''} ${item}`}
                titleStyle={{ fontSize: 16 }}
              />
            ))}
          </Menu>

          {/* Descrição */}
          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>📝 Descrição</Text>
          <TextInput
            label="Descrição*"
            mode="outlined"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            style={[styles.input, { height: 100 }]}
          />

          {/* Localização */}
          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>📍 Localização</Text>
          <TextInput
            label="Endereço*"
            mode="outlined"
            value={endereco}
            onChangeText={setEndereco}
            style={styles.input}
          />
          <TextInput
            label="Número"
            mode="outlined"
            value={numero}
            onChangeText={setNumero}
            style={styles.input}
          />
          <TextInput
            label="Complemento"
            mode="outlined"
            value={complemento}
            onChangeText={setComplemento}
            style={styles.input}
          />
          {loadingLocation ? (
            <Button mode="outlined" disabled loading style={{ marginBottom: 12 }}>
              Buscando localização...
            </Button>
          ) : (
            <Button mode="outlined" onPress={obterLocalizacao} style={{ marginBottom: 12 }}>
              Usar minha localização
            </Button>
          )}

          {/* Detalhes adicionais */}
          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>📅 Detalhes do serviço</Text>
          <TextInput
            label="Data e hora"
            mode="outlined"
            value={dataHora}
            onChangeText={setDataHora}
            placeholder="Ex: Hoje às 14h"
            style={styles.input}
          />
          <TextInput
            label="Urgência"
            mode="outlined"
            value={urgencia}
            onChangeText={setUrgencia}
            placeholder="Ex: Urgente, Flexível..."
            style={styles.input}
          />
          <TextInput
            label="Contato preferido"
            mode="outlined"
            value={contato}
            onChangeText={setContato}
            placeholder="WhatsApp, Chat, Ligar..."
            style={styles.input}
          />
          <TextInput
            label="Observações"
            mode="outlined"
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            numberOfLines={2}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            disabled={!categoria || !descricao || !endereco}
          >
            Publicar pedido
          </Button>

          <HelperText type="info" visible style={{ marginTop: 8 }}>
            Os campos com * são obrigatórios
          </HelperText>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={success}
        onDismiss={() => setSuccess(false)}
        duration={3000}
      >
        Pedido publicado com sucesso!
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#701ff2',
  },
  divider: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
    borderRadius: 8,
  },
});
