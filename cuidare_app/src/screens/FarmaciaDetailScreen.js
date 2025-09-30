import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';
// 1. Importamos o nosso componente de filtro reutilizável
import FilterChip from '../components/FilterChip';

const FarmaciaDetailScreen = ({ route, navigation }) => {
  const { farmaciaId } = route.params;

  const [farmacia, setFarmacia] = useState(null);
  const [products, setProducts] = useState([]); // Guarda a lista original de produtos
  const [filteredProducts, setFilteredProducts] = useState([]); // Guarda a lista filtrada
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 2. Novo estado para controlar os filtros ativos
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    // A busca inicial de dados continua a mesma
    const fetchFarmaciaData = async () => {
      if (!farmaciaId) return;
      setLoading(true);

      const { data: farmaciaData } = await supabase.from('Farmacia').select('*, Endereco_Farmacia(*)').eq('CNPJ', farmaciaId).single();
      setFarmacia(farmaciaData);

      const { data: productsData } = await supabase.from('Estoque').select('*, Produto(*), Farmacia(*)').eq('idFarmacia', farmaciaId);
      setProducts(productsData || []);
      setFilteredProducts(productsData || []);
      
      setLoading(false);
    };
    fetchFarmaciaData();
  }, [farmaciaId]);
  
  // 3. useEffect para aplicar os filtros e a busca de texto
  useEffect(() => {
    let filtered = [...products]; // Começa com a lista completa de produtos

    // Filtra pelo texto da busca
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.Produto.Nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtra por "Promoções"
    if (activeFilters.includes('Promoções')) {
      filtered = filtered.filter(item => item.Preco_Antigo !== null);
    }
    
    // Filtra por tipo ("Remédio" ou "Cosmético")
    const typeFilters = activeFilters.filter(f => f !== 'Promoções');
    if (typeFilters.length > 0) {
        filtered = filtered.filter(item => typeFilters.includes(item.Produto.tipo));
    }

    setFilteredProducts(filtered);
  }, [searchQuery, products, activeFilters]);

  // Função para adicionar/remover um filtro da lista de ativos
  const toggleFilter = (filter) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  if (loading) { /* ... tela de loading ... */ }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} color="#333" /></TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Detalhes da Farmácia</Text>
        <View style={{width: 28}} />
      </View>
      
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.idEstoque.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContentContainer}
        renderItem={({ item }) => (
            item.Produto && ( // Verificação de segurança
                <View style={styles.productCardWrapper}>
                    <ProductCard
                        productData={item}
                        name={item.Produto.Nome}
                        currentPrice={`R$${item.Preco.toFixed(2)}`}
                        oldPrice={item.Preco_Antigo ? `R$${item.Preco_Antigo.toFixed(2)}` : null}
                        image={{ uri: item.Produto.ImagemURL }}
                        onPress={() => navigation.navigate('ProductDetail', { productId: item.Produto.idProduto })}
                    />
                </View>
            )
        )}
        ListHeaderComponent={
          <>
            <View style={styles.farmaciaHeader}>
              <Text style={styles.farmaciaName}>{farmacia?.Nome}</Text>
              <Text style={styles.farmaciaAddress}>{`${farmacia?.Endereco_Farmacia?.Bairro}, ${farmacia?.Endereco_Farmacia?.Lote}`}</Text>
            </View>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput style={styles.searchInput} placeholder="Buscar produtos nesta farmácia..." value={searchQuery} onChangeText={setSearchQuery} />
            </View>

            {/* 4. BOTÕES DE FILTRO ADICIONADOS */}
            <View style={styles.filtersContainer}>
                <FilterChip label="Remédio" isActive={activeFilters.includes('Remédio')} onPress={() => toggleFilter('Remédio')} />
                <FilterChip label="Cosmético" isActive={activeFilters.includes('Cosmético')} onPress={() => toggleFilter('Cosmético')} />
                <FilterChip label="Promoções" isActive={activeFilters.includes('Promoções')} onPress={() => toggleFilter('Promoções')} />
            </View>

            <Text style={styles.sectionTitle}>Produtos</Text>
          </>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto encontrado.</Text>}
      />
      <BottomNav navigation={navigation} activeRoute="" />
    </SafeAreaView>
  );
};

const cardMargin = 8;
const screenPadding = 24;
const cardWidth = (Dimensions.get('window').width - screenPadding * 2 - cardMargin * 2) / 2;

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: 'white' },
    topHeader: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
    },
    topHeaderTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#333' },
    farmaciaHeader: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: 'white' },
    farmaciaName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    farmaciaAddress: { fontSize: 16, color: '#777' },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 12,
        marginHorizontal: 24, marginBottom: 16, paddingHorizontal: 16,
    },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, height: 50, fontSize: 16 },
    // Estilo para o container dos filtros
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 16, paddingHorizontal: 24 },
    listContentContainer: { paddingBottom: 24 },
    row: { flex: 1, justifyContent: 'space-between', paddingHorizontal: screenPadding - cardMargin },
    productCardWrapper: { width: cardWidth, marginBottom: 16, marginHorizontal: cardMargin },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#777' },
});

export default FarmaciaDetailScreen;