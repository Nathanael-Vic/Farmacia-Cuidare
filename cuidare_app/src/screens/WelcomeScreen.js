import React from 'react';
import { StyleSheet, View, Image, ImageBackground, Text } from 'react-native';
// Importamos nosso novo botão customizado
import CustomButton from '../components/CustomButton';

// A tela agora recebe uma propriedade especial chamada "navigation"
const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('../assets/images/imagem-topo.png')} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <Image 
            source={require('../assets/images/coracao.png')}
            style={styles.logo}
          />
          <Text style={styles.tagline}>
            Bem-estar e qualidade de vida na palma da sua mão!
          </Text>

          <View style={styles.actionsContainer}>
            {/* Usando nosso componente reutilizável! */}
            <CustomButton 
              title="Cadastre-se" 
              variant="primary" 
              onPress={() => navigation.navigate('Cadastro')} 
            />
            <CustomButton 
              title="Fazer Login" 
              variant="secondary"
              // Ao ser pressionado, navega para a tela com o nome "Login"
              onPress={() => navigation.navigate('Login')} 
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

// Os estilos continuam os mesmos
const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 78, 137, 0.85)',
    justifyContent: 'flex-end',
  },
  contentContainer: { padding: 32, alignItems: 'center' },
  logo: { width: 60, height: 60, marginBottom: 24 },
  tagline: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 40,
  },
  actionsContainer: { width: '100%', alignItems: 'center' },
});

export default WelcomeScreen;