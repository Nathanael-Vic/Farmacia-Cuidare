import React from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { FontAwesome5 } from '@expo/vector-icons'; 

const ProductCard = ({ productData, name, oldPrice, currentPrice, image, onPress }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // CORREÇÃO: Garantindo que o objeto tem todos os campos necessários
    const itemParaCarrinho = {
      id: productData.Produto.idProduto + '-' + productData.idFarmacia,
      idEstoque: productData.idEstoque,
      idFarmacia: productData.idFarmacia,
      name: productData.Produto.Nome,
      Preco: productData.Preco,
      image: { uri: productData.Produto.ImagemURL },
      farmaciaNome: productData.Farmacia.Nome,
      Quantidade: productData.Quantidade,
    };
    
    addToCart(itemParaCarrinho);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.image} />
      <View style={styles.detailsContainer}>
        <View>
          <Text style={styles.name} numberOfLines={2}>{name}</Text>
          <View style={styles.priceContainer}>
            {oldPrice && <Text style={styles.oldPrice}>{oldPrice}</Text>}
            <Text style={styles.currentPrice}>{currentPrice}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Adicionar</Text>
          <FontAwesome5 name="shopping-basket" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 170,
    height: 270, 
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    backgroundColor: '#f9f9f9',
  },
  detailsContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    minHeight: 34,
  },
  priceContainer: {
    minHeight: 50,
    justifyContent: 'flex-end',
  },
  oldPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#C00021',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#C00021',
    borderRadius: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductCard;