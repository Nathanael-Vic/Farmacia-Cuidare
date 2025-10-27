import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider, useCart } from './src/context/CartContext'; // Importe useCart
import { Platform, AppState } from 'react-native'; // Importe Platform e AppState

// --- Imports de Notificação ---
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// --- Telas de Fluxo Inicial e Autenticação (Cliente) ---
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';

// --- Telas de Fluxo Inicial e Autenticação (Entregador) ---
import SplashScreenEntregador from './src/screens/SplashScreenEntregador';
import WelcomeScreenEntregador from './src/screens/WelcomeScreenEntregador';
import LoginScreenEntregador from './src/screens/LoginScreenEntregador';

// --- Telas Principais (Cliente com BottomNav) ---
import HomeScreen from './src/screens/HomeScreen';
import BuscaScreen from './src/screens/BuscaScreen';
import CestaScreen from './src/screens/CestaScreen';
import PerfilScreen from './src/screens/PerfilScreen';

// --- Telas Principais (Entregador com BottomNav) ---
import HomeScreenEntregador from './src/screens/HomeScreenEntregador';
import GanhosScreen from './src/screens/GanhosScreen';
import PerfilScreenEntregador from './src/screens/PerfilScreenEntregador';

// --- Telas de Detalhes e Listas ---
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import FarmaciasListScreen from './src/screens/FarmaciasListScreen';
import FarmaciaDetailScreen from './src/screens/FarmaciaDetailScreen';

// --- Telas do Fluxo do Perfil ---
import EditProfileScreen from './src/screens/EditProfileScreen';
import InfoScreen from './src/screens/InfoScreen';

// --- Telas do Fluxo de Pagamento ---
import CheckoutScreen from './src/screens/CheckoutScreen';
import BoletoScreen from './src/screens/BoletoScreen';
import PixScreen from './src/screens/PixScreen';
import OrderSuccessScreen from './src/screens/OrderSuccessScreen';

// --- Tela de Admin ---
import AdminPanelScreen from './src/screens/AdminPanelScreen';

// Cria o navegador
const Stack = createNativeStackNavigator();

// --- LÓGICA DE NOTIFICAÇÃO ---

// 1. Configura o app para mostrar notificações mesmo se estiver aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 2. Função para pedir permissão de notificação
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Permissão de notificação negada!');
      return;
    }
  } else {
    console.log('Testando em simulador. Notificações físicas desativadas.');
  }
}

// 3. Componente "invisível" que cuida da notificação de carrinho abandonado
function CartNotificationHandler() {
  const { items } = useCart();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {

      if (appState.current.match(/active/) && nextAppState === 'background') {
        console.log('App foi para background. Verificando carrinho...');

        if (items.length > 0) {
          console.log(`Carrinho com ${items.length} itens. Agendando notificação...`);

          Notifications.scheduleNotificationAsync({
            content: {
              title: "Seu carrinho sente sua falta! 🛒",
              body: `Você esqueceu ${items.length} ${items.length > 1 ? 'itens' : 'item'} na cesta. Volte e finalize sua compra!`,
              data: { screen: 'Cesta' },
            },
            trigger: {
              seconds: 5,
            },
            identifier: 'cart-abandon',
          });
        }
      }

      if (appState.current.match(/background/) && nextAppState === 'active') {
        console.log('App voltou! Cancelando notificação de carrinho.');
        Notifications.cancelScheduledNotificationAsync('cart-abandon');
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [items]);

  return null; // Este componente não renderiza nada na tela
}

// --- FIM DA LÓGICA DE NOTIFICAÇÃO ---


export default function App() {

  // 4. Pede a permissão assim que o app carregar
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <CartProvider>
      {/* 5. Adiciona o componente "invisível" DENTRO do CartProvider */}
      <CartNotificationHandler />

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          {/* === FLUXO CLIENTE === */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />

          {/* === FLUXO ENTREGADOR === */}
          <Stack.Screen name="SplashEntregador" component={SplashScreenEntregador} />
          <Stack.Screen name="WelcomeEntregador" component={WelcomeScreenEntregador} />
          <Stack.Screen name="LoginEntregador" component={LoginScreenEntregador} />

          {/* === TELAS PRINCIPAIS CLIENTE === */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Busca" component={BuscaScreen} />
          <Stack.Screen name="Cesta" component={CestaScreen} />
          {/* ERRO REMOVIDO DAQUI */}
          <Stack.Screen name="Perfil" component={PerfilScreen} />

          {/* === TELAS PRINCIPAIS ENTREGADOR === */}
          <Stack.Screen name="HomeEntregador" component={HomeScreenEntregador} />
          <Stack.Screen name="Ganhos" component={GanhosScreen} />
          <Stack.Screen name="PerfilEntregador" component={PerfilScreenEntregador} />

          {/* === TELAS SECUNDÁRIAS (COMPARTILHADAS) === */}
          {/* ERRO REMOVIDO DAQUI */}
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="FarmaciasList" component={FarmaciasListScreen} />
          <Stack.Screen name="FarmaciaDetail" component={FarmaciaDetailScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Info" component={InfoScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Boleto" component={BoletoScreen} />
          <Stack.Screen name="Pix" component={PixScreen} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
          <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}