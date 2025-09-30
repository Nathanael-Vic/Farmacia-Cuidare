import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

// A tela agora recebe a propriedade "navigation"
const SplashScreen = ({ navigation }) => {
  // useEffect vai rodar assim que a tela aparecer
  useEffect(() => {
    // Após 3 segundos...
    setTimeout(() => {
      // ...navega para a tela 'Welcome', substituindo a splash.
      navigation.replace('Welcome'); 
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/coracao.png')} 
          style={styles.logoImage} 
        />
        <Text style={styles.logoText}>Cuidare</Text>
      </View>
    </View>
  );
};

// Os estilos continuam os mesmos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004E89',
    justifyContent: 'center',
    alignItems: 'center',
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