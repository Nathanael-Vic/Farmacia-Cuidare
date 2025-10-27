// Adicione 'useEffect' e 'useRef' nos imports
import React, { useEffect, useRef } from 'react'; 
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView from 'react-native-maps'; 
import BottomNavEntregador from '../components/BottomNavEntregador';
// Importe a biblioteca de notificações
import * as Notifications from 'expo-notifications'; 

const HomeScreenEntregador = ({ navigation }) => {

  // Usamos 'useRef' para o contador não se perder entre renders
  const notificationCount = useRef(0);

  // ADICIONE ESTE useEffect
  useEffect(() => {
    console.log("Iniciando 'detector' de entregas...");

    // Roda a cada 5 segundos
    const intervalId = setInterval(async () => {
      // 1. CONDIÇÃO: Para se já tivermos enviado 5
      if (notificationCount.current >= 5) {
        console.log("Máximo de 5 notificações de entrega atingido. Parando...");
        clearInterval(intervalId);
        return;
      }

      // 2. CONDIÇÃO: 1 chance em 10 (Math.random() < 0.1)
      const chance = Math.random();
      if (chance < 0.1) {
        console.log("Nova entrega! Enviando notificação...");
        notificationCount.current += 1; // Incrementa o contador

        // Dispara a notificação IMEDIATAMENTE (trigger: null)
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Nova Entrega Disponível! 🛵",
            body: "Um novo pedido está disponível para retirada. Toque para ver os detalhes!",
            data: { screen: 'HomeEntregador' },
          },
          trigger: null, // 'null' significa "agora"
        });

        console.log(`Notificação ${notificationCount.current} de 5 enviada.`);
      } else {
        console.log("Verificado... sem novas entregas.");
      }
    }, 5000); // 5000ms = 5 segundos

    // Limpa o intervalo quando a tela é "desmontada" (usuário sai dela)
    return () => {
      console.log("Saindo da tela Home, parando 'detector'...");
      clearInterval(intervalId);
    };
  }, []); // O array vazio [] faz isso rodar só 1 vez quando a tela abre

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* ... (o resto do seu JSX da tela Home do Entregador) ... */}

      <View style={styles.headerContainer}>
        <View style={styles.statusButton}> 
          <Text style={styles.statusText}>Indisponível</Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFillObject} 
          initialRegion={{ 
            latitude: -15.793889,
            longitude: -47.882778,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true} 
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar Entregas</Text>
        </TouchableOpacity>
      </View>

      <BottomNavEntregador 
        navigation={navigation} 
        activeRoute="HomeEntregador" 
      />
    </SafeAreaView>
  );
};

// ... (o resto dos seus 'styles')
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#C00021', // Fundo vermelho para status bar
  },
  headerContainer: {
    backgroundColor: '#C00021', // Fundo vermelho (cor principal)
    paddingHorizontal: 20,
    paddingVertical: 12, 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 10, 
  },
  statusButton: {
    backgroundColor: 'white',
    paddingVertical: 18, 
    width: '100%', 
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0', 
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700', 
    color: '#333333', 
  },
  mapContainer: {
    flex: 1, 
    backgroundColor: '#f0f0f0', 
  },
  searchButton: {
    position: 'absolute', 
    bottom: 24, 
    alignSelf: 'center', 
    backgroundColor: '#0096C7', 
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 5, 
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HomeScreenEntregador;