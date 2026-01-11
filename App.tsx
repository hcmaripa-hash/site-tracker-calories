import React from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/contexts/AppContext';
import AlimentacaoScreen from './src/screens/AlimentacaoScreen';
import CaloriasScreen from './src/screens/CaloriasScreen';
import InformacoesScreen from './src/screens/InformacoesScreen';
import BaseNutricionalScreen from './src/screens/BaseNutricionalScreen';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useState } from 'react';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.homeScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.homeContainer}>
        <Text style={styles.title}>Rastreador de Calorias</Text>
        <Text style={styles.subtitle}>Bem-vindo! Use o menu para navegar.</Text>

        <View style={styles.quickAccessContainer}>
          <TouchableOpacity
            style={[styles.quickButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => navigation.navigate('Alimentacao')}
          >
            <MaterialCommunityIcons name="food-apple" size={32} color="#fff" />
            <Text style={styles.quickButtonText}>Alimentação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickButton, { backgroundColor: '#2196F3' }]}
            onPress={() => navigation.navigate('Informacoes')}
          >
            <MaterialCommunityIcons name="arm-flex" size={32} color="#fff" />
            <Text style={styles.quickButtonText}>Info Física</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickButton, { backgroundColor: '#FF9800' }]}
            onPress={() => navigation.navigate('Calorias')}
          >
            <Ionicons name="stats-chart" size={32} color="#fff" />
            <Text style={styles.quickButtonText}>Calorias</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickButton, { backgroundColor: '#9C27B0' }]}
            onPress={() => navigation.navigate('BaseNutricional')}
          >
            <MaterialIcons name="menu-book" size={32} color="#fff" />
            <Text style={styles.quickButtonText}>Base Nutricional</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function CustomHeader({ navigation, title }: any) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => setMenuVisible(!menuVisible)}
          style={styles.hamburgerButton}
        >
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuPanel}>
            <Text style={styles.menuPanelTitle}>Menu</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('Home');
                setMenuVisible(false);
              }}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name="home" size={20} color="#333" />
                <Text style={styles.menuItemText}>Início</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('Alimentacao');
                setMenuVisible(false);
              }}
            >
              <View style={styles.menuItemContent}>
                <MaterialCommunityIcons name="food-apple" size={20} color="#333" />
                <Text style={styles.menuItemText}>Alimentação</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('Informacoes');
                setMenuVisible(false);
              }}
            >
              <View style={styles.menuItemContent}>
                <MaterialCommunityIcons name="arm-flex" size={20} color="#333" />
                <Text style={styles.menuItemText}>Informações Físicas</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('Calorias');
                setMenuVisible(false);
              }}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name="stats-chart" size={20} color="#333" />
                <Text style={styles.menuItemText}>Calorias Consumidas</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('BaseNutricional');
                setMenuVisible(false);
              }}
            >
              <View style={styles.menuItemContent}>
                <MaterialIcons name="menu-book" size={20} color="#333" />
                <Text style={styles.menuItemText}>Base Nutricional</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    MaterialIcons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
    MaterialCommunityIcons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
  });

  if (!fontsLoaded) {
    return null; // ou um loading simples
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={({ navigation, route }: any) => ({
            headerShown: true,
            header: () => (
              <CustomHeader navigation={navigation} title={route.name} />
            ),
          })}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Alimentacao" component={AlimentacaoScreen} />
          <Stack.Screen name="Informacoes" component={InformacoesScreen} />
          <Stack.Screen name="Calorias" component={CaloriasScreen} />
          <Stack.Screen name="BaseNutricional" component={BaseNutricionalScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  homeScroll: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  homeContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  quickAccessContainer: {
    width: '100%',
    gap: 15,
  },
  quickButton: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContainer: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 30,
  },
  hamburgerButton: {
    padding: 10,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerText: {
    fontSize: 28,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuPanel: {
    backgroundColor: '#fff',
    width: '75%',
    height: '100%',
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  menuPanelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
