import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import PharmacyOfferCard from '../components/PharmacyOfferCard';
import ReviewItem from '../components/ReviewItem';
import BottomNav from '../components/BottomNav';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);

        const { data: productData, error: productError } = await supabase
          .from('Produto')
          .select(`*, Remedio(*)`)
          .eq('idProduto', productId)
          .single();

        if (productError) throw productError;
        setProduct(productData);
        
        // CORREÇÃO: Buscando todos os campos necessários do Estoque e da Farmácia
        const { data: offerData, error: offerError } = await supabase
          .from('Estoque')
          .select(`
            idEstoque, 
            Quantidade, 
            Preco, 
            Preco_Antigo, 
            Farmacia (
                CNPJ, 
                Nome 
            )
          `)
          .eq('idProduto', productId);

        if (offerError) throw offerError;
        setOffers(offerData || []);

      } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);
  
  if (loading) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.centered}><ActivityIndicator size="large" color="#004E89" /></View>
      </SafeAreaView>
    );
  }
  
  if (!product) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} color="white" /></TouchableOpacity>
          <Text style={styles.headerTitle}>Erro</Text><View style={{width: 28}}/>
        </View>
        <View style={styles.centered}><Text>Produto não encontrado.</Text></View>
      </SafeAreaView>
    );
  }

  const bestOffer = offers.length > 0 ? [...offers].sort((a, b) => a.Preco - b.Preco)[0] : null;

  const handleAddBestOfferToCart = () => {
    if (!bestOffer) return Alert.alert("Indisponível", "Este produto não tem ofertas no momento.");
    
    // CORREÇÃO: Montando o objeto cartItem com TODOS os dados necessários
    const cartItem = {
      id: product.idProduto + '-' + bestOffer.Farmacia.CNPJ,
      idEstoque: bestOffer.idEstoque,
      idFarmacia: bestOffer.Farmacia.CNPJ,
      name: product.Nome,
      Preco: bestOffer.Preco,
      image: { uri: product.ImagemURL },
      farmaciaNome: bestOffer.Farmacia.Nome,
      Quantidade: bestOffer.Quantidade,
    };
    addToCart(cartItem);
  };

  const reviews = [
    { name: 'Camila', rating: 4, comment: 'Corem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { name: 'Paula', rating: 5, comment: 'Corem ipsum dolor sit amet, consectetur adipiscing elit.' },
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} color="white" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Produtos</Text>
        <TouchableOpacity><Image source={require('../assets/images/coracao.png')} style={styles.headerIcon} /></TouchableOpacity>
      </View>
      <ScrollView>
        <Image source={{ uri: product.ImagemURL }} style={styles.productImage} />
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.productName}>{product.Nome}</Text>
              {bestOffer?.Preco_Antigo && <Text style={styles.oldPrice}>R${bestOffer.Preco_Antigo.toFixed(2)}</Text>}
              {bestOffer?.Preco && <Text style={styles.currentPrice}>R${bestOffer.Preco.toFixed(2)}</Text>}
            </View>
            <TouchableOpacity style={styles.cartButton} onPress={handleAddBestOfferToCart}>
              <Ionicons name="basket" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}><Text style={styles.sectionTitle}>Descrição do produto</Text><Text style={styles.descriptionText}>{product.Descricao}</Text></View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Onde encontrar</Text>
            {offers.length > 0 ? (
                offers.map((offer, index) => <PharmacyOfferCard key={index} offer={offer} product={product} onPressPharmacy={() => navigation.navigate('FarmaciaDetail', { farmaciaId: offer.Farmacia.CNPJ })}/>)
            ) : ( <Text>Nenhuma farmácia tem este produto em estoque no momento.</Text> )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avaliações</Text>
            {reviews.map((review, index) => <ReviewItem key={index} name={review.name} rating={review.rating} comment={review.comment} />)}
          </View>
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} activeRoute="" /> 
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: 'white' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#004E89' },
    headerTitle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold' },
    headerIcon: { width: 28, height: 28 },
    productImage: { width: '100%', height: 300, resizeMode: 'contain', backgroundColor: '#f9f9f9' },
    container: { padding: 24 },
    infoContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    priceContainer: { flex: 1, marginRight: 16 },
    productName: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    oldPrice: { fontSize: 16, color: '#999', textDecorationLine: 'line-through' },
    currentPrice: { fontSize: 28, fontWeight: 'bold', color: '#C00021' },
    cartButton: { backgroundColor: '#C00021', padding: 16, borderRadius: 12, alignSelf: 'flex-end' },
    section: { marginTop: 24 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    descriptionText: { fontSize: 16, color: '#777', lineHeight: 24 },
});

export default ProductDetailScreen;