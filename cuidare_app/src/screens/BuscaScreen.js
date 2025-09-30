import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import LargeCategoryButton from '../components/LargeCategoryButton';
import FilterChip from '../components/FilterChip';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';

const BuscaScreen = ({ route, navigation }) => {
  const initialFilter = route.params?.initialFilter;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialFilter && activeFilters.length === 0) {
      setActiveFilters([initialFilter]);
    }
  }, [initialFilter]);
  
  useEffect(() => {
    const isSearchActive = searchQuery.length > 0 || activeFilters.length > 0;
    setIsSearching(isSearchActive);
    
    if (isSearchActive) {
      const searchTimeout = setTimeout(() => performSearch(), 500);
      return () => clearTimeout(searchTimeout);
    } else {
      setResults([]);
    }
  }, [searchQuery, activeFilters]);

  const performSearch = async () => {
    setLoading(true);
    let query = supabase
      .from('Estoque')
      .select(`*, Produto!inner(*), Farmacia(*)`)
      .ilike('Produto.Nome', `%${searchQuery}%`);
      
    if (activeFilters.includes('Promoções')) {
      query = query.not('Preco_Antigo', 'is', null);
    }
    const typeFilters = activeFilters.filter(f => f !== 'Promoções');
    if (typeFilters.length > 0) {
      query = query.in('Produto.tipo', typeFilters);
    }
    const { data, error } = await query;
    if (error) { Alert.alert('Erro na busca', error.message); console.error(error); }
    else { setResults(data || []); }
    setLoading(false);
  };

  const toggleFilter = (filter) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
      ? prev.filter(f => f !== filter)
      : [...prev, filter]
    );
  };

  const handleCategoryPress = (filter) => {
    setActiveFilters([filter]);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}><Text style={styles.headerTitle}>Busca de Produtos</Text></View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="O que deseja buscar?" value={searchQuery} onChangeText={setSearchQuery} />
      </View>
      
      <View style={styles.contentContainer}>
        {isSearching && (
            <View style={styles.filtersContainer}>
                <FilterChip label="Remédio" isActive={activeFilters.includes('Remédio')} onPress={() => toggleFilter('Remédio')} />
                <FilterChip label="Cosmético" isActive={activeFilters.includes('Cosmético')} onPress={() => toggleFilter('Cosmético')} />
                <FilterChip label="Promoções" isActive={activeFilters.includes('Promoções')} onPress={() => toggleFilter('Promoções')} />
            </View>
        )}

        {loading ? (
            <ActivityIndicator size="large" color="#004E89" style={{flex: 1}} />
        ) : isSearching ? (
            <FlatList
                data={results}
                keyExtractor={(item) => item.idEstoque.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContentContainer}
                renderItem={({ item }) => (
                    item.Produto && (
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
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto encontrado.</Text>}
            />
        ) : (
            <View style={styles.categoriesContainer}>
                {/* BOTÃO "FARMÁCIA" DE VOLTA E FUNCIONANDO */}
                <LargeCategoryButton iconName="medkit" title="Farmácias" subtitle="Busque produtos pelos nossos parceiros preferidos!" onPress={() => navigation.navigate('FarmaciasList')} />
                <LargeCategoryButton iconName="pricetag" title="Promoções" subtitle="Visualize todas as promoções disponíveis!" onPress={() => handleCategoryPress('Promoções')} />
                <LargeCategoryButton iconName="color-palette" title="Cosméticos" subtitle="Os melhores produtos de cuidado e beleza!" onPress={() => handleCategoryPress('Cosmético')} />
                <LargeCategoryButton iconName="pulse" title="Remédios" subtitle="As melhores marcas, com os melhores preços!" onPress={() => handleCategoryPress('Remédio')} />
            </View>
        )}
      </View>
      
      <BottomNav navigation={navigation} activeRoute="Busca" />
    </SafeAreaView>
  );
};

const cardMargin = 8;
const screenPadding = 16;
const cardWidth = (Dimensions.get('window').width - screenPadding * 2 - cardMargin * 2) / 2;

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: 'white' },
    header: { padding: 16, backgroundColor: '#004E89' },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 12, margin: 16, paddingHorizontal: 16 },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, height: 50, fontSize: 16 },
    contentContainer: {
        flex: 1,
    },
    filtersContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, paddingBottom: 16 },
    categoriesContainer: { padding: 16, flex: 1 },
    listContentContainer: { paddingBottom: 16 },
    row: { justifyContent: 'space-between', paddingHorizontal: screenPadding - cardMargin },
    productCardWrapper: { width: cardWidth, marginBottom: 16, marginHorizontal: cardMargin },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#777' },
});

export default BuscaScreen;