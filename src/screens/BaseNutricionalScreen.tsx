import { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { AppContext } from '../contexts/AppContext';

interface ItemBase {
  id: string;
  nome: string;
  calorias: number;
}

export default function BaseNutricionalScreen() {
  const context = useContext(AppContext);
  const [nome, setNome] = useState('');
  const [calorias, setCalorias] = useState('');
  const [itens, setItens] = useState<ItemBase[]>([]);

  useEffect(() => {
    carregarItens();
  }, []);

  const carregarItens = async () => {
    if (!context) return;
    const lista = await context.listarItensBase();
    setItens(lista);
  };

  const handleAdicionar = async () => {
    if (!nome.trim() || !calorias.trim()) {
      Alert.alert('Atenção', 'Preencha nome e calorias.');
      return;
    }

    const caloriasNum = parseFloat(calorias);
    if (Number.isNaN(caloriasNum)) {
      Alert.alert('Atenção', 'Calorias deve ser um número.');
      return;
    }

    if (!context) return;

    const novoItem: ItemBase = {
      id: Date.now().toString(),
      nome: nome.trim(),
      calorias: caloriasNum,
    };

    await context.adicionarItemBase(novoItem);
    setNome('');
    setCalorias('');
    carregarItens();
  };

  const handleRemover = async (id: string) => {
    if (!context) return;
    await context.removerItemBase(id);
    carregarItens();
  };

  const renderItem = ({ item }: { item: ItemBase }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemCalorias}>{item.calorias} cal / 100g</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemover(item.id)}>
        <Text style={styles.deleteText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Base Nutricional</Text>
      <Text style={styles.subtitle}>Cadastre itens com calorias para reutilizar nas refeições.</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome do item"
          value={nome}
          onChangeText={setNome}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Calorias por 100g"
          value={calorias}
          onChangeText={setCalorias}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.button} onPress={handleAdicionar}>
          <Text style={styles.buttonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Nenhum item cadastrado ainda.</Text>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemCalorias: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 12,
  },
});
