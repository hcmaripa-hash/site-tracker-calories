import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

interface ItemBase {
  id: string;
  nome: string;
  calorias: number;
}

export default function AlimentacaoScreen() {
  const context = useContext(AppContext);
  const [produto, setProduto] = useState('');
  const [quantidadeGramas, setQuantidadeGramas] = useState('');
  const [produtos, setProdutos] = useState<any[]>([]);
  const [baseItens, setBaseItens] = useState<ItemBase[]>([]);
  const [sugestoes, setSugestoes] = useState<ItemBase[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<ItemBase | null>(null);

  useEffect(() => {
    carregarProdutos();
    carregarBase();
  }, []);

  const carregarProdutos = async () => {
    if (context) {
      const today = new Date().toISOString().split('T')[0];
      const dados = await context.obterAlimentacao(today);
      setProdutos(dados);
    }
  };

  const carregarBase = async () => {
    if (!context) return;
    const itens = await context.listarItensBase();
    setBaseItens(itens);
  };

  const filtrarSugestoes = (texto: string) => {
    const termo = texto.trim().toLowerCase();
    if (!termo) {
      setSugestoes([]);
      return;
    }

    const filtrados = baseItens
      .filter((item) => item.nome.toLowerCase().includes(termo))
      .slice(0, 5);

    setSugestoes(filtrados);
  };

  const handleAddProduto = async () => {
    if (!produto.trim() || !quantidadeGramas.trim()) {
      Alert.alert('Erro', 'Selecione um item da base e informe a quantidade consumida.');
      return;
    }

    const baseItem = itemSelecionado || baseItens.find((i) => i.nome === produto.trim());
    if (!baseItem) {
      Alert.alert('Erro', 'Escolha um item cadastrado na base nutricional.');
      return;
    }

    if (context) {
      const today = new Date().toISOString().split('T')[0];
      const gramasNum = parseFloat(quantidadeGramas);
      if (Number.isNaN(gramasNum)) {
        Alert.alert('Erro', 'Use apenas números em gramas.');
        return;
      }

      const caloriasTotais = (baseItem.calorias * gramasNum) / 100;
      await context.adicionarAlimentacao({
        id: Date.now().toString(),
        produto: baseItem.nome,
        calorias: Math.round(caloriasTotais * 100) / 100,
        quantidadeGramas: gramasNum,
        caloriasPor100g: baseItem.calorias,
        baseId: baseItem.id,
        data: today,
      });
      setProduto('');
      setQuantidadeGramas('');
      setItemSelecionado(null);
      carregarProdutos();
    }
  };

  const handleRemover = async (id: string) => {
    if (context) {
      await context.removerAlimentacao(id);
      carregarProdutos();
    }
  };

  const totalCalorias = produtos.reduce((acc, p) => acc + p.calorias, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alimentação do Dia</Text>

      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Nome do Produto"
            value={produto}
            onChangeText={(text) => {
              setProduto(text);
              filtrarSugestoes(text);
              setItemSelecionado(null);
            }}
            placeholderTextColor="#999"
          />

          {sugestoes.length > 0 && (
            <View style={styles.suggestions}>
              {sugestoes.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setProduto(item.nome);
                    setItemSelecionado(item);
                    setSugestoes([]);
                  }}
                >
                  <Text style={styles.suggestionName}>{item.nome}</Text>
                  <Text style={styles.suggestionCal}>{item.calorias} cal / 100g</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TextInput
          style={[styles.input, styles.inputSpacing]}
          placeholder="Quantidade consumida (g)"
          value={quantidadeGramas}
          onChangeText={setQuantidadeGramas}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={handleAddProduto}>
          <Text style={styles.buttonText}>+ Adicionar Produto</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer}>
        {produtos.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.produto}</Text>
              <Text style={styles.itemCalorias}>{item.calorias} cal</Text>
              {item.quantidadeGramas ? (
                <Text style={styles.itemQuantidade}>
                  {item.quantidadeGramas} g • {item.caloriasPor100g ?? '?'} cal/100g
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleRemover(item.id)}
            >
              <Text style={styles.deleteText}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total do Dia:</Text>
        <Text style={styles.totalValue}>{totalCalorias} cal</Text>
      </View>
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
    marginBottom: 20,
    color: '#333',
    marginTop: 10,
  },
  form: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
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
    marginBottom: 0,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  inputSpacing: {
    marginBottom: 12,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  suggestions: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  suggestionCal: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  itemCalorias: {
    fontSize: 14,
    color: '#666',
  },
  itemQuantidade: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
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
  total: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#4CAF50',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
