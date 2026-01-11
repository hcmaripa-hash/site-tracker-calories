import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';

export default function CaloriasScreen() {
  const context = useContext(AppContext);
  const [filtro, setFiltro] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [calorias, setCalorias] = useState(0);
  const [metaDiaria, setMetaDiaria] = useState(2000);
  const [informacoesFisicas, setInformacoesFisicas] = useState<any>(null);
  const [caloriasPorDia, setCaloriasPorDia] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    carregarDados();
  }, [filtro]);

  const carregarDados = async () => {
    if (!context) return;

    // Carregar informações físicas salvas
    const infos = await context.obterInformacoesFisicas();
    if (infos) {
      setInformacoesFisicas(infos);
      if (infos.caloriasMeta) {
        setMetaDiaria(infos.caloriasMeta);
      }
    }

    if (filtro === 'mes') {
      const caloriasDia = await context.obterCaloriasPorDiaMes();
      setCaloriasPorDia(caloriasDia);
      setCalorias(Object.values(caloriasDia).reduce((sum, cal) => sum + cal, 0));
    } else {
      calcularCalorias();
    }
  };

  const calcularCalorias = async () => {
    if (!context) return;

    const today = new Date();
    let dataInicial = new Date(today);
    let diasNoPeriodo = 1;

    if (filtro === 'semana') {
      const primeiro = today.getDate() - today.getDay();
      dataInicial = new Date(today.setDate(primeiro));
      diasNoPeriodo = 7;
    } else if (filtro === 'mes') {
      dataInicial = new Date(today.getFullYear(), today.getMonth(), 1);
      diasNoPeriodo = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    }

    const totalCals = await context.obterTotalCalorias(dataInicial, filtro);
    setCalorias(totalCals);
  };

  const getFiltroTexto = () => {
    switch (filtro) {
      case 'dia':
        return 'Hoje';
      case 'semana':
        return 'Esta Semana';
      case 'mes':
        return 'Este Mês';
    }
  };

  const getDiasPeriodo = () => {
    const today = new Date();
    if (filtro === 'dia') return 1;
    if (filtro === 'semana') return 7;
    return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  };

  const getMetaTotalPeriodo = () => {
    return metaDiaria * getDiasPeriodo();
  };

  const getDiferenca = () => {
    if (filtro === 'dia') return metaDiaria - calorias;
    return getMetaTotalPeriodo() - calorias;
  };

  const getPercentualMeta = () => {
    if (metaDiaria <= 0) return 0;
    if (filtro === 'dia') {
      return Math.round((calorias / metaDiaria) * 100);
    }
    const metaTotal = getMetaTotalPeriodo();
    if (metaTotal <= 0) return 0;
    return Math.round((calorias / metaTotal) * 100);
  };

  const getStatusCor = () => {
    const diferenca = getDiferenca();
    if (filtro !== 'dia') {
      const metaTotal = getMetaTotalPeriodo();
      if (calorias > metaTotal) return '#ff6b6b';
      if (calorias > metaTotal * 0.9) return '#FFC107';
      return '#4CAF50';
    }
    if (diferenca < 0) return '#ff6b6b';
    if (diferenca < 200) return '#FFC107';
    return '#4CAF50';
  };

  const getStatusTexto = () => {
    if (filtro === 'dia') {
      const diferenca = getDiferenca();
      if (diferenca < 0) return '⚠️ Acima da meta';
      if (diferenca < 200) return '⏱️ Perto da meta';
      return '✅ Dentro da meta';
    } else {
      const metaTotal = getMetaTotalPeriodo();
      if (calorias > metaTotal) return '⚠️ Acima da meta';
      if (calorias > metaTotal * 0.9) return '⏱️ Perto da meta';
      return '✅ Dentro da meta';
    }
  };

  const botoes = [
    { label: 'Dia', value: 'dia' as const },
    { label: 'Semana', value: 'semana' as const },
    { label: 'Mês', value: 'mes' as const },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Calorias Consumidas</Text>

        <View style={styles.filtrosContainer}>
          {botoes.map((btn) => (
            <TouchableOpacity
              key={btn.value}
              style={[
                styles.filtroButton,
                filtro === btn.value && styles.filtroButtonActive,
              ]}
              onPress={() => setFiltro(btn.value)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.filtroText,
                  filtro === btn.value && styles.filtroTextActive,
                ]}
              >
                {btn.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.resultadoContainer}>
          <Text style={styles.periodLabel}>{getFiltroTexto()}</Text>
          <View style={styles.caloriaBox}>
            <Text style={styles.caloriaValue}>{calorias}</Text>
            <Text style={styles.caloriaUnidade}>calorias</Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={[styles.statusTexto, { color: getStatusCor() }]}>
              {getStatusTexto()}
            </Text>
          </View>

          <View style={styles.metaComparacaoBox}>
            <View style={styles.metaItem}>
              <Text style={styles.metaItemLabel}>Meta</Text>
              <Text style={styles.metaItemValue}>
                {filtro === 'dia' ? metaDiaria : getMetaTotalPeriodo()} cal
              </Text>
            </View>
            <View style={styles.divisor} />
            <View style={styles.metaItem}>
              <Text style={styles.metaItemLabel}>Consumido</Text>
              <Text style={[styles.metaItemValue, { color: getStatusCor() }]}>
                {calorias} cal
              </Text>
            </View>
            <View style={styles.divisor} />
            <View style={styles.metaItem}>
              <Text style={styles.metaItemLabel}>
                {filtro === 'dia' ? 'Restante' : 'Diferença'}
              </Text>
              <Text
                style={[
                  styles.metaItemValue,
                  { color: getDiferenca() >= 0 ? '#4CAF50' : '#ff6b6b' },
                ]}
              >
                {Math.abs(getDiferenca())} cal
              </Text>
            </View>
          </View>

          <View style={styles.barraProgresso}>
            <View
              style={[
                styles.barraProgressoFill,
                {
                  width: `${Math.min(getPercentualMeta(), 100)}%`,
                  backgroundColor: getStatusCor(),
                },
              ]}
            />
          </View>
          <Text style={styles.percentualTexto}>{getPercentualMeta()}% da meta</Text>
        </View>

        {filtro === 'mes' && (
          <View style={styles.diasContainer}>
            <Text style={styles.diasTitle}>Calorias por Dia</Text>
            <View style={styles.diasGrid}>
              {Object.entries(caloriasPorDia).map(([dia, cal]) => (
                <View key={dia} style={styles.diaItem}>
                  <Text style={styles.diaNumero}>{dia}</Text>
                  <Text style={styles.diaCalorias}>{cal}</Text>
                  <View style={styles.diaBarra}>
                    <View
                      style={[
                        styles.diaBarraFill,
                        {
                          width: `${Math.min((cal / metaDiaria) * 100, 100)}%`,
                          backgroundColor: cal > metaDiaria ? '#ff6b6b' : cal > metaDiaria * 0.9 ? '#FFC107' : '#4CAF50',
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {informacoesFisicas && (
          <View style={styles.infoSalvaContainer}>
            <Text style={styles.infoTitle}>Configuração de Meta Atual</Text>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Meta Diária:</Text>
              <Text style={styles.infoValue}>{metaDiaria} calorias</Text>
            </View>

            {informacoesFisicas.kgPorSemana && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Objetivo:</Text>
                <Text style={styles.infoValue}>
                  Perder {informacoesFisicas.kgPorSemana} kg por semana
                </Text>
              </View>
            )}

            {informacoesFisicas.nivelAtividade && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Nível de Atividade:</Text>
                <Text style={styles.infoValue}>
                  {informacoesFisicas.nivelAtividade.charAt(0).toUpperCase() +
                    informacoesFisicas.nivelAtividade.slice(1)}
                </Text>
              </View>
            )}

            {informacoesFisicas.tdee && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Gasto Diário (TDEE):</Text>
                <Text style={styles.infoValue}>{informacoesFisicas.tdee} calorias</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.dicasContainer}>
          <Text style={styles.dicasTitle}>💡 Dicas Importantes</Text>
          {filtro === 'dia' && (
            <>
              <Text style={styles.dica}>
                • Sua meta diária é de <Text style={styles.dicaDestaque}>{metaDiaria} calorias</Text>
              </Text>
              <Text style={styles.dica}>
                • Você pode comer <Text style={styles.dicaDestaque}>{metaDiaria - calorias}</Text>{' '}
                calorias ainda hoje
              </Text>
              {getDiferenca() >= 0 && (
                <Text style={styles.dica}>
                  • Registre suas refeições para manter o controle
                </Text>
              )}
            </>
          )}

          {filtro === 'semana' && (
            <>
              <Text style={styles.dica}>
                • Meta semanal: <Text style={styles.dicaDestaque}>{getMetaTotalPeriodo()} calorias</Text>
              </Text>
              <Text style={styles.dica}>
                • Você consumiu <Text style={styles.dicaDestaque}>{getPercentualMeta()}%</Text> da meta
              </Text>
            </>
          )}

          {filtro === 'mes' && (
            <>
              <Text style={styles.dica}>
                • Meta mensal: <Text style={styles.dicaDestaque}>{getMetaTotalPeriodo()} calorias</Text>
              </Text>
              <Text style={styles.dica}>
                • Você consumiu <Text style={styles.dicaDestaque}>{getPercentualMeta()}%</Text> da meta
              </Text>
            </>
          )}
        </View>
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
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  filtroButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  filtroButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filtroText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filtroTextActive: {
    color: '#fff',
  },
  resultadoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  caloriaBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  caloriaValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  caloriaUnidade: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  statusContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  statusTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metaComparacaoBox: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaItemLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  metaItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  divisor: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
  },
  barraProgresso: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barraProgressoFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentualTexto: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoSalvaContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  dicasContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dicasTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 12,
  },
  dica: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginVertical: 4,
  },
  dicaDestaque: {
    fontWeight: 'bold',
    color: '#FF9800',
  },
  diasContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  diasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  diasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  diaItem: {
    width: '18%', // Aproximadamente 5 itens por linha
    alignItems: 'center',
    marginBottom: 15,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  diaNumero: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  diaCalorias: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  diaBarra: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  diaBarraFill: {
    height: '100%',
    borderRadius: 2,
  },
});
