import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { useCart } from '../context/CartContext';

const PixScreen = ({ route, navigation }) => {
  const { amount, idPagamento } = route.params;
  const { confirmPayment } = useCart();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    await confirmPayment(idPagamento, navigation);
    // A navegação e o Alert de erro são tratados dentro de confirmPayment
  };
  
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} color="white" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Forma de pagamento</Text>
        <View style={{width: 28}} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.paymentMethodTitle}>Pix</Text>
        <View style={styles.card}>
            <Image source={require('../assets/images/qrcode-placeholder.png')} style={styles.codeImage}/>
            <Text style={styles.pixInfo}>informações do pix</Text>
            <View style={styles.priceContainer}><Text style={styles.priceText}>R$ {amount.toFixed(2)}</Text></View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <CustomButton 
            title={isConfirming ? "Processando..." : "Concluir"}
            onPress={handleConfirm}
            disabled={isConfirming}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: 'white' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#004E89' },
    headerTitle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold' },
    container: { padding: 24, flexGrow: 1 },
    paymentMethodTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' },
    card: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 16, alignItems: 'center' },
    codeImage: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 16 },
    pixInfo: { fontSize: 14, color: '#555', marginBottom: 16 },
    priceContainer: { backgroundColor: '#0096C7', padding: 16, borderRadius: 8, alignSelf: 'stretch' },
    priceText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: 'white' },
});

export default PixScreen;