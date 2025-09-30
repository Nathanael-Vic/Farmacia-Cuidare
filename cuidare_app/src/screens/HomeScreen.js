import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef(null);
  const scrollRef = useRef(null);
  const directionRef = useRef(1);

  const banners = [
    require('../assets/images/banner-01.jpg'),
    require('../assets/images/banner-02.jpg'),
    require('../assets/images/banner-03.jpg'),
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // CORREÇÃO: Verificamos se 'clienteData' foi encontrado
        const { data: clienteData } = await supabase.from('Cliente').select(`Nome, Endereco_Cliente (*)`).eq('id', user.id).single();

        if (clienteData) {
          setProfile(clienteData);
        } else {
          // Se não encontrou (usuário novo), define um perfil padrão para não quebrar a tela
          setProfile({ Nome: 'Usuário', Endereco_Cliente: null });
          console.log("Perfil do cliente não encontrado na tabela 'Cliente', usando fallback.");
        }
      }

      const { data: productData, error: productError } = await supabase
        .from('Estoque')
        .select(`
          idEstoque,
          Quantidade,
          Preco,
          Preco_Antigo,
          idFarmacia,
          Produto (
            idProduto,
            Nome,
            ImagemURL
          ),
          Farmacia (
            CNPJ,
            Nome
          )
        `)
        .gt('Quantidade', 0)
        .limit(10);

      if (productError) {
        console.error("Erro ao buscar produtos:", productError.message);
      } else {
        const productsGrouped = (productData || []).reduce((acc, item) => {
          const productId = item.Produto.idProduto;
          if (!acc[productId]) {
            acc[productId] = [];
          }
          acc[productId].push(item);
          return acc;
        }, {});

        const uniqueProducts = Object.values(productsGrouped).map(group => {
          const availableOptions = group.filter(item => item.Quantidade > 0);

          if (availableOptions.length === 0) {
            return { ...group[0], Quantidade: 0, Preco: null };
          }

          const bestOption = availableOptions.reduce((lowest, current) => {
            return current.Preco < lowest.Preco ? current : lowest;
          });

          return bestOption;
        });

        setProducts(uniqueProducts);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const autoScroll = setInterval(() => {
      let nextSlide = activeSlide + directionRef.current;
      if (nextSlide >= banners.length) {
        nextSlide = banners.length - 2;
        directionRef.current = -1;
      } else if (nextSlide < 0) {
        nextSlide = 1;
        directionRef.current = 1;
      }
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: nextSlide * screenWidth, animated: true });
      }
    }, 8000);
    return () => clearInterval(autoScroll);
  }, [activeSlide, banners.length]);

  const onScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveSlide(slideIndex);
  };

  const handleSecretMenuPress = () => {
    clearTimeout(clickTimer.current);
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5) {
      Alert.alert("Acesso Secreto", "Painel de Administrador desbloqueado!");
      navigation.navigate('AdminPanel');
      setClickCount(0);
    } else {
      clickTimer.current = setTimeout(() => { setClickCount(0); }, 1500);
    }
  };

  // CORREÇÃO: Lógica para exibir o endereço ou uma mensagem padrão
  const userAddress = profile?.Endereco_Cliente
    ? `${profile.Endereco_Cliente.Bairro}, ${profile.Endereco_Cliente.Lote}`
    : 'Complete seu endereço';

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <View>
          {/* A lógica aqui já funciona com a correção acima, pois 'profile.Nome' existirá */}
          <Text style={styles.headerTitle}>Olá, {profile ? profile.Nome.split(' ')[0] : '...'}</Text>
          <Text style={styles.headerSubtitle}>{userAddress}</Text>
        </View>
        <TouchableOpacity onPress={handleSecretMenuPress}>
          <Image source={require('../assets/images/coracao-plus.png')} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.carouselSection}>
          <ScrollView ref={scrollRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16} snapToInterval={screenWidth} decelerationRate="fast">
            {banners.map((banner, index) => (
              <View key={index} style={styles.slideContainer}><Image source={banner} style={styles.carouselImage} /></View>
            ))}
          </ScrollView>
          <View style={styles.dotsContainer}>
            {banners.map((_, index) => (<View key={index} style={[styles.dot, activeSlide === index ? styles.dotActive : {}]} />))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <CategoryCard label="Farmácia" icon={require('../assets/images/icon-farmacia.png')} onPress={() => navigation.navigate('FarmaciasList')} />
            <CategoryCard label="Remédios" icon={require('../assets/images/icon-remedios.png')} onPress={() => navigation.navigate('Busca', { initialFilter: 'Remédio' })} />
            <CategoryCard label="Cosméticos" icon={require('../assets/images/icon-cosmeticos.png')} onPress={() => navigation.navigate('Busca', { initialFilter: 'Cosmético' })} />
            <CategoryCard label="Promoções" icon={require('../assets/images/icon-promocoes.png')} onPress={() => navigation.navigate('Busca', { initialFilter: 'Promoções' })} />
          </ScrollView>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mais vendidos da semana</Text>
          {loading ? (<ActivityIndicator size="large" color="#004E89" style={{ marginTop: 20 }} />) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
              {products.map((item) => (
                <ProductCard
                  key={item.idEstoque}
                  productData={item}
                  name={item.Produto.Nome}
                  // CORREÇÃO: Adicionado uma verificação para evitar erro se Preco for null
                  currentPrice={item.Preco ? `R$${item.Preco.toFixed(2)}` : ''}
                  oldPrice={item.Preco_Antigo ? `R$${item.Preco_Antigo.toFixed(2)}` : null}
                  image={{ uri: item.Produto.ImagemURL }}
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.Produto.idProduto })}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} activeRoute="Home" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f4f6f8' },
  header: { backgroundColor: '#004E89', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: '700' },
  headerSubtitle: { color: 'white', opacity: 0.8 },
  headerIcon: { width: 40, height: 40, resizeMode: 'contain' },
  carouselSection: { marginTop: 24, marginBottom: 16 },
  slideContainer: { width: screenWidth, alignItems: 'center' },
  carouselImage: { width: screenWidth * 0.9, height: (screenWidth * 0.9) / 2.3, borderRadius: 16 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#004E89' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 16, paddingHorizontal: 24 },
  scrollContainer: { paddingHorizontal: 24 },
});

export default HomeScreen;