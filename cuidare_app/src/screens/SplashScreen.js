import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
// ADICIONADO: SafeAreaView para posicionar o botão
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = ({ navigation }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome'); // Esta é a tela de Welcome NORMAL
    }, 3000);

    // Limpa o timer se o usuário sair da tela (ex: clicando no botão)
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    // MODIFICADO: Envolvido com SafeAreaView
    <SafeAreaView style={styles.safeArea}>
      {/* ADICIONADO: Botão no topo */}
      <View style={styles.headerButtonContainer}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            // Navega para o fluxo de entregador
            navigation.navigate('SplashEntregador');
          }}
        >
          <Text style={styles.headerButtonText}>É um entregador?</Text>
        </TouchableOpacity>
      </View>

      {/* Seu conteúdo original, agora centralizado com flex: 1 */}
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/coracao.png')}
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>Cuidare</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ADICIONADO: Estilo para o SafeAreaView
  safeArea: {
    flex: 1,
    backgroundColor: '#004E89',
  },
  // ADICIONADO: Container do botão no topo
  headerButtonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-end', // Joga para a direita
  },
  // ADICIONADO: Estilo do botão
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fundo transparente
    borderRadius: 20,
  },
  // ADICIONADO: Estilo do texto do botão
  headerButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  // MODIFICADO: Container principal
  container: {
    flex: 1, // Ocupa o resto do espaço
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50, // Adiciona um padding para compensar o botão de cima
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  logoText: {
    color: 'white',
    fontSize: 40,
    fontWeight: '600',
  },
});

export default SplashScreen;