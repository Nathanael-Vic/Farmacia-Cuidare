import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './src/context/CartContext';

// --- Telas de Fluxo Inicial e Autenticação ---
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';

// --- Telas Principais (com BottomNav) ---
import HomeScreen from './src/screens/HomeScreen';
import BuscaScreen from './src/screens/BuscaScreen';
import CestaScreen from './src/screens/CestaScreen';
import PerfilScreen from './src/screens/PerfilScreen';

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

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Splash" 
          screenOptions={{ headerShown: false }}
        >
          {/* Telas de Autenticação e Fluxo Inicial */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />
          
          {/* Telas Principais do App */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Busca" component={BuscaScreen} />
          <Stack.Screen name="Cesta" component={CestaScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />
          
          {/* Telas de Detalhes e Secundárias */}
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="FarmaciasList" component={FarmaciasListScreen} />
          <Stack.Screen name="FarmaciaDetail" component={FarmaciaDetailScreen} />

          {/* Telas do Perfil */}
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Info" component={InfoScreen} />
          
          {/* Telas de Pagamento */}
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Boleto" component={BoletoScreen} />
          <Stack.Screen name="Pix" component={PixScreen} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
          
          {/* Telas Secretas / Admin */}
          <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}