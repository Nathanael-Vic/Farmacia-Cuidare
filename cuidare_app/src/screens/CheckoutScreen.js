import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';

const CheckoutScreen = ({ navigation }) => {
  const { items, totalPrice, createPendingOrder } = useCart();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if(user) {
            const { data: clienteData, error } = await supabase.from('Cliente').select('*, Endereco_Cliente(*), TelefoneCliente(*)').eq('id', user.id).single();
            if (error) throw error;
            setProfile(clienteData);
        }
      } catch (error) {
        Alert.alert("Erro ao buscar dados do perfil", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProceedToPayment = async () => {
    if (!selectedMethod) {
      return Alert.alert("Atenção", "Por favor, selecione uma forma de pagamento.");
    }
    if (!profile) {
      return Alert.alert("Erro", "Não foi possível carregar os dados do seu perfil. Tente novamente.");
    }
    
    setLoading(true);

    // Chama a função que CRIA o pedido pendente no banco de dados
    const result = await createPendingOrder(selectedMethod, profile, totalPrice);
    
    setLoading(false);

    if (result.success) {
      // Se o pedido foi criado, NAVEGA para a tela de pagamento correspondente
      navigation.navigate(selectedMethod, {
          amount: totalPrice,
          idPagamento: result.idPagamento,
          profile: profile // Passamos o perfil para a próxima tela também
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#004E89" />
      </SafeAreaView>
    );
  }
  
  const summaryItem = items.length > 0 ? items[0] : null;

  return (
    <SafeAreaView style={styles.wrapper}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} color="white" /></TouchableOpacity>
            <Text style={styles.headerTitle}>Pagamento</Text>
            <Image source={require('../assets/images/coracao.png')} style={{width: 28, height: 28}} />
        </View>
        <ScrollView contentContainerStyle={styles.container}>
            {summaryItem && (
                <View style={styles.summaryCard}>
                    <Image source={summaryItem.image} style={styles.summaryImage} />
                    <View style={styles.summaryDetails}>
                        <Text style={styles.summaryName} numberOfLines={2}>{summaryItem.name}</Text>
                        <Text style={styles.summaryPrice}>R${summaryItem.Preco.toFixed(2)}</Text>
                        <Text style={styles.summaryQuantity}>Quantidade: {summaryItem.quantity}</Text>
                        <Text style={styles.summaryFrete}>Frete: GRÁTIS</Text>
                    </View>
                </View>
            )}
            
            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Endereço</Text>
                <Text>{`${profile?.Endereco_Cliente?.Bairro || 'Bairro não informado'}, ${profile?.Endereco_Cliente?.Lote || 'Lote não informado'}`}</Text>
                <Text>{`${profile?.Endereco_Cliente?.Cidade || 'Cidade'} - ${profile?.Endereco_Cliente?.Estado || 'UF'}`}</Text>
                <TouchableOpacity style={styles.editButton}><Text style={styles.editButtonText}>Editar</Text></TouchableOpacity>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Contato</Text>
                <Text>Telefone: {profile?.TelefoneCliente[0]?.Telefone || 'Telefone não informado'}</Text>
                <Text>E-mail: {profile?.email || 'email@exemplo.com'}</Text>
                <TouchableOpacity style={styles.editButton}><Text style={styles.editButtonText}>Editar</Text></TouchableOpacity>
            </View>
            
            <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
            <View style={styles.paymentOptions}>
                <TouchableOpacity style={[styles.optionButton, selectedMethod === 'Cartao' && styles.optionActive]} onPress={() => setSelectedMethod('Cartao')}>
                    <Text style={[styles.optionText, selectedMethod === 'Cartao' && styles.optionTextActive]}>Cartão</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.optionButton, selectedMethod === 'Boleto' && styles.optionActive]} onPress={() => setSelectedMethod('Boleto')}>
                    <Text style={[styles.optionText, selectedMethod === 'Boleto' && styles.optionTextActive]}>Boleto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.optionButton, selectedMethod === 'Pix' && styles.optionActive]} onPress={() => setSelectedMethod('Pix')}>
                    <Text style={[styles.optionText, selectedMethod === 'Pix' && styles.optionTextActive]}>Pix</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        <View style={styles.footer}>
            <CustomButton title="Finalizar Pedido" onPress={handleProceedToPayment} />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: '#f4f6f8' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#004E89' },
    headerTitle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold' },
    container: { padding: 24, paddingBottom: 40 },
    summaryCard: { flexDirection: 'row', backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 24 },
    summaryImage: { width: 60, height: 60, borderRadius: 8, resizeMode: 'contain' },
    summaryDetails: { flex: 1, marginLeft: 16 },
    summaryName: { fontWeight: 'bold', fontSize: 16 },
    summaryPrice: { fontSize: 14, color: '#555' },
    summaryQuantity: { fontSize: 14, color: '#555' },
    summaryFrete: { fontSize: 14, color: 'green', fontWeight: 'bold' },
    infoSection: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    editButton: { position: 'absolute', top: 16, right: 16 },
    editButtonText: { color: '#0096C7', fontWeight: 'bold' },
    paymentOptions: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', padding: 16, borderRadius: 12 },
    optionButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 16, alignItems: 'center', width: 100, justifyContent: 'center', height: 60 },
    optionActive: { backgroundColor: '#004E89', borderColor: '#004E89' },
    optionText: { color: '#333', fontWeight: '600' },
    optionTextActive: { color: 'white' },
    footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: 'white' },
});

export default CheckoutScreen;