import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { useCart } from '../context/CartContext';

const BoletoScreen = ({ route, navigation }) => {
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forma de pagamento</Text>
        <View style={{width: 28}} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.paymentMethodTitle}>Boleto</Text>
        <View style={styles.card}>
            <Image 
                source={require('../assets/images/barcode-placeholder.png')} 
                style={styles.codeImage}
            />
            <Text style={styles.barcodeNumber}>23790.31265 60000.001618 64287.123456 8 00000000000000</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.priceText}>R$ {amount.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.copyButton}>
                <Text style={styles.copyButtonText}>Copiar Código</Text>
            </TouchableOpacity>
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
    codeImage: { width: '100%', height: 100, resizeMode: 'contain', marginBottom: 16 },
    barcodeNumber: { fontSize: 12, color: '#555', letterSpacing: 1, marginBottom: 16, textAlign: 'center' },
    priceContainer: { backgroundColor: '#0096C7', padding: 16, borderRadius: 8, alignSelf: 'stretch', marginBottom: 16 },
    priceText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    copyButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
    copyButtonText: { fontWeight: '600', color: '#333' },
    footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: 'white' },
});

export default BoletoScreen;