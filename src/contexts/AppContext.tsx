import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ItemBase {
  id: string;
  nome: string;
  calorias: number;
}

const BASE_PADRAO: ItemBase[] = [
  { id: 'seed-1', nome: 'Arroz branco cozido', calorias: 130 },
  { id: 'seed-2', nome: 'Arroz integral cozido', calorias: 124 },
  { id: 'seed-3', nome: 'Feijao carioca cozido', calorias: 76 },
  { id: 'seed-4', nome: 'Feijao preto cozido', calorias: 77 },
  { id: 'seed-5', nome: 'Peito de frango grelhado', calorias: 165 },
  { id: 'seed-6', nome: 'Carne bovina magra cozida', calorias: 217 },
  { id: 'seed-7', nome: 'Ovo cozido', calorias: 155 },
  { id: 'seed-8', nome: 'Pao frances', calorias: 270 },
  { id: 'seed-9', nome: 'Queijo mussarela', calorias: 280 },
  { id: 'seed-10', nome: 'Leite integral', calorias: 61 },
  { id: 'seed-11', nome: 'Iogurte natural integral', calorias: 61 },
  { id: 'seed-12', nome: 'Banana prata', calorias: 89 },
  { id: 'seed-13', nome: 'Maca', calorias: 52 },
  { id: 'seed-14', nome: 'Laranja', calorias: 47 },
  { id: 'seed-15', nome: 'Mamao', calorias: 43 },
  { id: 'seed-16', nome: 'Tomate', calorias: 18 },
  { id: 'seed-17', nome: 'Alface', calorias: 15 },
  { id: 'seed-18', nome: 'Batata inglesa cozida', calorias: 87 },
  { id: 'seed-19', nome: 'Batata doce cozida', calorias: 76 },
  { id: 'seed-20', nome: 'Mandioca cozida', calorias: 125 },
  { id: 'seed-21', nome: 'Farinha de mandioca', calorias: 360 },
  { id: 'seed-22', nome: 'Aveia em flocos', calorias: 389 },
  { id: 'seed-23', nome: 'Azeite de oliva', calorias: 884 },
  { id: 'seed-24', nome: 'Acucar', calorias: 387 },
  { id: 'seed-25', nome: 'Refrigerante cola', calorias: 39 },
  { id: 'seed-26', nome: 'Cafe sem acucar', calorias: 2 },
  { id: 'seed-27', nome: 'Lentilha cozida', calorias: 116 },
  { id: 'seed-28', nome: 'Grao-de-bico cozido', calorias: 164 },
];

export interface AppContextType {
  adicionarAlimentacao: (alimentacao: any) => Promise<void>;
  obterAlimentacao: (data: string) => Promise<any[]>;
  removerAlimentacao: (id: string) => Promise<void>;
  obterTotalCalorias: (dataInicial: Date, filtro: 'dia' | 'semana' | 'mes') => Promise<number>;
  salvarInformacoesFisicas: (info: any) => Promise<void>;
  obterInformacoesFisicas: () => Promise<any>;
  adicionarItemBase: (item: any) => Promise<void>;
  listarItensBase: () => Promise<any[]>;
  removerItemBase: (id: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [alimentacoes, setAlimentacoes] = useState<any[]>([]);
  const [informacoesFisicas, setInformacoesFisicas] = useState<any>(null);
  const [baseNutricional, setBaseNutricional] = useState<any[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const alimentacoesStr = await AsyncStorage.getItem('alimentacoes');
      const infosStr = await AsyncStorage.getItem('informacoesFisicas');
      const baseStr = await AsyncStorage.getItem('baseNutricional');
      
      if (alimentacoesStr) {
        setAlimentacoes(JSON.parse(alimentacoesStr));
      }
      if (infosStr) {
        setInformacoesFisicas(JSON.parse(infosStr));
      }
      if (baseStr) {
        const baseLista = JSON.parse(baseStr);
        if (Array.isArray(baseLista) && baseLista.length > 0) {
          setBaseNutricional(baseLista);
        } else {
          await seedBasePadrao();
        }
      } else {
        await seedBasePadrao();
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const seedBasePadrao = async () => {
    setBaseNutricional(BASE_PADRAO);
    await AsyncStorage.setItem('baseNutricional', JSON.stringify(BASE_PADRAO));
  };

  const adicionarAlimentacao = async (alimentacao: any) => {
    try {
      const novasAlimentacoes = [...alimentacoes, alimentacao];
      setAlimentacoes(novasAlimentacoes);
      await AsyncStorage.setItem('alimentacoes', JSON.stringify(novasAlimentacoes));
    } catch (error) {
      console.error('Erro ao adicionar alimentação:', error);
    }
  };

  const obterAlimentacao = async (data: string): Promise<any[]> => {
    try {
      const alimentacoesStr = await AsyncStorage.getItem('alimentacoes');
      if (!alimentacoesStr) return [];
      
      const todasAlimentacoes = JSON.parse(alimentacoesStr);
      return todasAlimentacoes.filter((a: any) => a.data === data);
    } catch (error) {
      console.error('Erro ao obter alimentação:', error);
      return [];
    }
  };

  const removerAlimentacao = async (id: string) => {
    try {
      const novasAlimentacoes = alimentacoes.filter((a) => a.id !== id);
      setAlimentacoes(novasAlimentacoes);
      await AsyncStorage.setItem('alimentacoes', JSON.stringify(novasAlimentacoes));
    } catch (error) {
      console.error('Erro ao remover alimentação:', error);
    }
  };

  const obterTotalCalorias = async (dataInicial: Date, filtro: 'dia' | 'semana' | 'mes'): Promise<number> => {
    try {
      const alimentacoesStr = await AsyncStorage.getItem('alimentacoes');
      if (!alimentacoesStr) return 0;

      const todasAlimentacoes = JSON.parse(alimentacoesStr);

      // Comparação por string de data (YYYY-MM-DD) para evitar problemas de timezone
      const toDateStr = (d: Date) => d.toISOString().split('T')[0];
      const hojeStr = toDateStr(new Date());

      let inicioStr = toDateStr(dataInicial);
      let fimStr = hojeStr;

      if (filtro === 'semana') {
        // dataInicial já vem ajustada no caller; fim é hoje
        inicioStr = toDateStr(dataInicial);
      } else if (filtro === 'mes') {
        inicioStr = toDateStr(dataInicial); // primeiro dia do mês
      }

      const alimentacoesFiltradas = todasAlimentacoes.filter((a: any) => {
        const dataStr = a.data; // já está no formato YYYY-MM-DD
        return dataStr >= inicioStr && dataStr <= fimStr;
      });

      return alimentacoesFiltradas.reduce((total: number, a: any) => total + a.calorias, 0);
    } catch (error) {
      console.error('Erro ao obter total de calorias:', error);
      return 0;
    }
  };

  const salvarInformacoesFisicas = async (info: any) => {
    try {
      setInformacoesFisicas(info);
      await AsyncStorage.setItem('informacoesFisicas', JSON.stringify(info));
    } catch (error) {
      console.error('Erro ao salvar informações físicas:', error);
    }
  };

  const obterInformacoesFisicas = async (): Promise<any> => {
    try {
      const infosStr = await AsyncStorage.getItem('informacoesFisicas');
      return infosStr ? JSON.parse(infosStr) : null;
    } catch (error) {
      console.error('Erro ao obter informações físicas:', error);
      return null;
    }
  };

  const adicionarItemBase = async (item: any) => {
    try {
      const novaLista = [...baseNutricional, item];
      setBaseNutricional(novaLista);
      await AsyncStorage.setItem('baseNutricional', JSON.stringify(novaLista));
    } catch (error) {
      console.error('Erro ao adicionar item base:', error);
    }
  };

  const listarItensBase = async (): Promise<any[]> => {
    try {
      const baseStr = await AsyncStorage.getItem('baseNutricional');
      if (!baseStr) return [];
      return JSON.parse(baseStr);
    } catch (error) {
      console.error('Erro ao listar itens base:', error);
      return [];
    }
  };

  const removerItemBase = async (id: string) => {
    try {
      const novaLista = baseNutricional.filter((i) => i.id !== id);
      setBaseNutricional(novaLista);
      await AsyncStorage.setItem('baseNutricional', JSON.stringify(novaLista));
    } catch (error) {
      console.error('Erro ao remover item base:', error);
    }
  };

  const value: AppContextType = {
    adicionarAlimentacao,
    obterAlimentacao,
    removerAlimentacao,
    obterTotalCalorias,
    salvarInformacoesFisicas,
    obterInformacoesFisicas,
    adicionarItemBase,
    listarItensBase,
    removerItemBase,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
