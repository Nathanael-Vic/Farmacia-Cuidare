import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';

// Componente para um item da lista do carrinho
const CartItem = ({ item }) => {
  const { updateQuantity } = useCart();
  return (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        {/* LINHA ADICIONADA ABAIXO */}
        <Text style={styles.itemPharmacy}>Vendido por: {item.farmaciaNome}</Text>
        <Text style={styles.itemPrice}>R${item.Preco.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityStepper}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
          <Ionicons name="remove-circle-outline" size={28} color="#555" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
          <Ionicons name="add-circle" size={28} color="#004E89" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CestaScreen = ({ navigation }) => {
  const { items, totalPrice } = useCart();

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cesta de Produtos</Text>
        <Image source={require('../assets/images/coracao.png')} style={styles.headerIcon} />
      </View>

      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={({ item }) => <CartItem item={item} />}
          keyExtractor={item => item.id}
          ListFooterComponent={
            <View style={styles.footer}>
              <Text style={styles.totalText}>Total: R${totalPrice.toFixed(2)}</Text>
              <CustomButton
                title="Ir para o pagamento"
                onPress={() => navigation.navigate('Checkout')} // Leva para a nova tela
              />
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Sua cesta está vazia.</Text>
        </View>
      )}

      <BottomNav navigation={navigation} activeRoute="Cesta" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f4f6f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#004E89' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  headerIcon: { width: 28, height: 28 },
  itemContainer: { flexDirection: 'row', backgroundColor: 'white', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', alignItems: 'center' },
  itemImage: { width: 60, height: 60, borderRadius: 8, resizeMode: 'contain' },
  itemDetails: { flex: 1, marginLeft: 16 },
  itemName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  // ESTILO PARA O NOME DA FARMÁCIA
  itemPharmacy: { fontSize: 12, color: '#777', marginBottom: 4 },
  itemPrice: { fontSize: 14, color: '#C00021', fontWeight: 'bold' },
  quantityStepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quantityText: { fontSize: 18, fontWeight: 'bold' },
  footer: { padding: 24 },
  totalText: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginBottom: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#777' },
});

export default CestaScreen;