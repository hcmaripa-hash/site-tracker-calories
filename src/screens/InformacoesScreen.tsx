import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useContext } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppContext } from '../contexts/AppContext';

export default function InformacoesScreen() {
  const context = useContext(AppContext);
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState<'M' | 'F'>('M');
  const [nivelAtividade, setNivelAtividade] = useState<'sedentario' | 'leve' | 'moderado' | 'intenso'>('moderado');
  const [kgPorSemana, setKgPorSemana] = useState('0.5');
  const [imc, setImc] = useState<number | null>(null);
  const [tmb, setTmb] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [caloriasMeta, setCaloriasMeta] = useState<number | null>(null);
  const [savedInfo, setSavedInfo] = useState<any>(null);
  const [showSexoPicker, setShowSexoPicker] = useState(false);
  const [showAtividadePicker, setShowAtividadePicker] = useState(false);

  const handleSalvar = async () => {
    if (!peso || !altura || !idade) {
      Alert.alert('Erro', 'Preencha peso, altura e idade!');
      return;
    }

    // Calcular IMC
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura) / 100;
    const imcCalc = pesoNum / (alturaNum * alturaNum);
    const imcValue = parseFloat(imcCalc.toFixed(2));
    setImc(imcValue);

    // Calcular TMB
    const alturaNumCm = parseFloat(altura);
    const idadeNum = parseInt(idade);
    let tmbCalc: number;

    if (sexo === 'M') {
      tmbCalc = 10 * pesoNum + 6.25 * alturaNumCm - 5 * idadeNum + 5;
    } else {
      tmbCalc = 10 * pesoNum + 6.25 * alturaNumCm - 5 * idadeNum - 161;
    }
    const tmbValue = parseFloat(tmbCalc.toFixed(2));
    setTmb(tmbValue);

    // Calcular TDEE
    const fatoresAtividade = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725,
    };

    const tdeeCalc = tmbValue * fatoresAtividade[nivelAtividade];
    const tdeeValue = parseFloat(tdeeCalc.toFixed(2));
    setTdee(tdeeValue);

    // Calcular Calorias Meta
    const kgNum = parseFloat(kgPorSemana);
    const deficitDiario = (kgNum * 7700) / 7;
    const caloriasMataCalc = tdeeValue - deficitDiario;
    const caloriasMetaValue = Math.max(1200, parseFloat(caloriasMataCalc.toFixed(0)));
    setCaloriasMeta(caloriasMetaValue);

    // Salvar no context
    const info = {
      peso: pesoNum,
      altura: parseFloat(altura),
      idade: idadeNum,
      sexo,
      nivelAtividade,
      imc: imcValue,
      tmb: tmbValue,
      tdee: tdeeValue,
      kgPorSemana: kgNum,
      caloriasMeta: caloriasMetaValue,
      data: new Date().toISOString(),
    };

    if (context) {
      await context.salvarInformacoesFisicas(info);
      setSavedInfo(info);
      Alert.alert('Sucesso', 'Informações salvas com sucesso!');
    }
  };

  const getClassificacaoIMC = (imcValue: number) => {
    if (imcValue < 18.5) return 'Abaixo do Peso';
    if (imcValue < 25) return 'Peso Normal';
    if (imcValue < 30) return 'Sobrepeso';
    return 'Obeso';
  };

  const getCorIMC = (imcValue: number) => {
    if (imcValue < 18.5) return '#ff9800';
    if (imcValue < 25) return '#4CAF50';
    if (imcValue < 30) return '#FFC107';
    return '#ff6b6b';
  };

  const getNivelAtividadeTexto = (
    nivel?: 'sedentario' | 'leve' | 'moderado' | 'intenso',
  ) => {
    const textos = {
      sedentario: 'Sedentário (pouca atividade)',
      leve: 'Leve (exercício 1-3 dias/semana)',
      moderado: 'Moderado (exercício 3-5 dias/semana)',
      intenso: 'Intenso (exercício 6-7 dias/semana)',
    };
    return textos[nivel ?? nivelAtividade];
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Informações Físicas</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            value={peso}
            onChangeText={setPeso}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Altura (cm)"
            value={altura}
            onChangeText={setAltura}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Idade (anos)"
            value={idade}
            onChangeText={setIdade}
            keyboardType="number-pad"
            placeholderTextColor="#999"
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Sexo:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowSexoPicker(!showSexoPicker)}
            >
              <Text style={styles.pickerButtonText}>
                {sexo === 'M' ? 'Masculino' : 'Feminino'}
              </Text>
            </TouchableOpacity>
          </View>

          {showSexoPicker && (
            <View style={styles.pickerOptions}>
              <TouchableOpacity
                style={styles.pickerOption}
                onPress={() => {
                  setSexo('M');
                  setShowSexoPicker(false);
                }}
              >
                <Text style={styles.pickerOptionText}>Masculino</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pickerOption}
                onPress={() => {
                  setSexo('F');
                  setShowSexoPicker(false);
                }}
              >
                <Text style={styles.pickerOptionText}>Feminino</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Nível de Atividade:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowAtividadePicker(!showAtividadePicker)}
            >
              <Text style={styles.pickerButtonText}>{getNivelAtividadeTexto()}</Text>
            </TouchableOpacity>
          </View>

          {showAtividadePicker && (
            <View style={styles.pickerOptions}>
              {(['sedentario', 'leve', 'moderado', 'intenso'] as const).map((nivel) => (
                <TouchableOpacity
                  key={nivel}
                  style={styles.pickerOption}
                  onPress={() => {
                    setNivelAtividade(nivel);
                    setShowAtividadePicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>
                    {getNivelAtividadeTexto(nivel)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>

        {imc && (
          <View style={styles.imcResultContainer}>
            <Text style={styles.imcLabel}>Seu IMC</Text>
            <View
              style={[
                styles.imcCircle,
                { backgroundColor: getCorIMC(imc) + '20' },
              ]}
            >
              <Text style={[styles.imcValue, { color: getCorIMC(imc) }]}>
                {imc}
              </Text>
            </View>
            <Text style={styles.imcClassificacao}>
              {getClassificacaoIMC(imc)}
            </Text>
          </View>
        )}

        <View style={styles.calculosContainer}>
          <Text style={styles.subtitleCalculos}>Configurar Perda de Peso</Text>

          {tmb && (
            <View style={styles.resultadoBox}>
              <Text style={styles.resultadoLabel}>TMB (Taxa Metabólica Basal):</Text>
              <Text style={styles.resultadoValue}>{tmb} calorias/dia</Text>
              <Text style={styles.resultadoDesc}>
                Calorias para manter funções vitais em repouso
              </Text>
            </View>
          )}

          {tdee && (
            <View style={styles.resultadoBox}>
              <Text style={styles.resultadoLabel}>TDEE (Gasto Calórico Diário):</Text>
              <Text style={styles.resultadoValue}>{tdee} calorias/dia</Text>
              <Text style={styles.resultadoDesc}>
                Calorias totais gastas incluindo atividades
              </Text>
            </View>
          )}

          {tdee && (
            <View style={styles.form}>
              <Text style={styles.pickerLabel}>KG a perder por semana:</Text>
              <View style={styles.kgSelector}>
                {['0.25', '0.5', '0.75', '1'].map((kg) => (
                  <TouchableOpacity
                    key={kg}
                    style={[
                      styles.kgOption,
                      kgPorSemana === kg && styles.kgOptionActive,
                    ]}
                    onPress={() => setKgPorSemana(kg)}
                  >
                    <Text
                      style={[
                        styles.kgOptionText,
                        kgPorSemana === kg && styles.kgOptionTextActive,
                      ]}
                    >
                      {kg} kg
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {caloriasMeta && (
            <View style={styles.metaCaloriasBox}>
              <Text style={styles.metaLabel}>Meta de Calorias Diária:</Text>
              <Text style={styles.metaValue}>{caloriasMeta}</Text>
              <Text style={styles.metaUnit}>calorias/dia</Text>
              <View style={styles.metaInfo}>
                <View style={styles.metaInfoRow}>
                  <MaterialCommunityIcons name="chart-bell-curve" size={16} color="#4CAF50" />
                  <Text style={styles.metaInfoText}>Para perder {kgPorSemana} kg por semana</Text>
                </View>
                <View style={styles.metaInfoRow}>
                  <MaterialCommunityIcons name="run" size={16} color="#4CAF50" />
                  <Text style={styles.metaInfoText}>Com seu nível de atividade: {getNivelAtividadeTexto()}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={handleSalvar}>
            <View style={styles.buttonContent}>
              <Ionicons name="save" size={18} color="#fff" />
              <Text style={styles.buttonText}>Calcular e Salvar</Text>
            </View>
          </TouchableOpacity>
        </View>

        {savedInfo && (
          <View style={styles.savedDataContainer}>
            <Text style={styles.savedTitle}>Últimas Informações Salvas</Text>
            <View style={styles.savedItem}>
              <Text style={styles.savedLabel}>Peso:</Text>
              <Text style={styles.savedValue}>{savedInfo.peso} kg</Text>
            </View>
            <View style={styles.savedItem}>
              <Text style={styles.savedLabel}>Altura:</Text>
              <Text style={styles.savedValue}>{savedInfo.altura} cm</Text>
            </View>
            <View style={styles.savedItem}>
              <Text style={styles.savedLabel}>Idade:</Text>
              <Text style={styles.savedValue}>{savedInfo.idade} anos</Text>
            </View>
            <View style={styles.savedItem}>
              <Text style={styles.savedLabel}>IMC:</Text>
              <Text
                style={[
                  styles.savedValue,
                  { color: getCorIMC(savedInfo.imc) },
                ]}
              >
                {savedInfo.imc}
              </Text>
            </View>
            {savedInfo.tmb && (
              <View style={styles.savedItem}>
                <Text style={styles.savedLabel}>TMB:</Text>
                <Text style={styles.savedValue}>{savedInfo.tmb} cal/dia</Text>
              </View>
            )}
            {savedInfo.tdee && (
              <View style={styles.savedItem}>
                <Text style={styles.savedLabel}>TDEE:</Text>
                <Text style={styles.savedValue}>{savedInfo.tdee} cal/dia</Text>
              </View>
            )}
            {savedInfo.caloriasMeta && (
              <View style={[styles.savedItem, { backgroundColor: '#4CAF5015' }]}>
                <Text style={styles.savedLabel}>Meta Diária:</Text>
                <Text style={[styles.savedValue, { color: '#4CAF50', fontWeight: 'bold' }]}>
                  {savedInfo.caloriasMeta} cal/dia
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
  subtitleCalculos: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
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
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  buttonSecondary: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonCalc: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptions: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#333',
  },
  imcResultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imcLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  imcCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  imcValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  imcClassificacao: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  calculosContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultadoBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  resultadoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resultadoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 5,
  },
  resultadoDesc: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  kgSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  kgOption: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  kgOptionActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  kgOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  kgOptionTextActive: {
    color: '#fff',
  },
  metaCaloriasBox: {
    backgroundColor: '#4CAF5015',
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 8,
  },
  metaValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  metaUnit: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 15,
  },
  metaInfo: {
    width: '100%',
  },
  metaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  metaInfoText: {
    fontSize: 12,
    color: '#4CAF50',
    marginVertical: 4,
    fontWeight: '500',
  },
  savedDataContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  savedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  savedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  savedLabel: {
    fontSize: 14,
    color: '#666',
  },
  savedValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
