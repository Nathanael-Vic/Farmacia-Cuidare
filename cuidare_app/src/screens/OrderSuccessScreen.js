import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

const OrderSuccessScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={60} color="white" />
          </View>
          <Text style={styles.title}>Compra finalizada com sucesso!</Text>
          <View style={styles.buttonWrapper}>
            <CustomButton 
              title="Página Inicial" 
              variant="primary" 
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <CustomButton 
              title="Acompanhar Pedido" 
              variant="secondary" 
              onPress={() => { /* Navegaria para a tela de 'Meus Pedidos' no futuro */ }} 
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escuro semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#C00021', // Vermelho
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#333',
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 8, // Remove a margem do botão customizado para ter controle aqui
  },
});

export default OrderSuccessScreen;