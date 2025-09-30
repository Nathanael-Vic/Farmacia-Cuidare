import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

// O componente agora recebe o objeto 'product' e 'offer' completos
const PharmacyOfferCard = ({ offer, product, onPressPharmacy }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Monta o objeto completo para o carrinho, agora com todos os dados
    const cartItem = {
      id: product.idProduto + '-' + offer.Farmacia.CNPJ,
      idEstoque: offer.idEstoque, // A informação que estava faltando!
      idFarmacia: offer.Farmacia.CNPJ,
      name: product.Nome,
      Preco: offer.Preco,
      image: { uri: product.ImagemURL },
      farmaciaNome: offer.Farmacia.Nome,
      Quantidade: offer.Quantidade,
    };
    
    addToCart(cartItem);
    // Não precisamos mais do Alert aqui, pois ele já está no CartContext
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.infoContainer} onPress={onPressPharmacy}>
        <Text style={styles.pharmacyName}>{offer.Farmacia.Nome}</Text>
        <Text style={styles.distance}>Distância simulada</Text>
        <Text style={styles.price}>R${offer.Preco.toFixed(2)}</Text>
      </TouchableOpacity>
      {/* O botão agora tem sua própria função interna para adicionar ao carrinho */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addButtonText}>Adicionar</Text>
        <Ionicons name="basket-outline" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004E89',
    textDecorationLine: 'underline',
  },
  distance: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C00021',
  },
  addButton: {
    backgroundColor: '#C00021',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default PharmacyOfferCard;