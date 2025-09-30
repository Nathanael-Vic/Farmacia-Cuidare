import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const BottomNav = ({ navigation, activeRoute }) => {
  
  // Componente interno para evitar repetição de código
  const NavItem = ({ name, iconName, route }) => {
    const isActive = activeRoute === route;
    return (
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => {
            // Apenas navega se a rota existir e não for a ativa
            if (route && !isActive) navigation.navigate(route);
        }}
      >
        {/* LÓGICA DE COR CORRIGIDA AQUI */}
        <Ionicons 
          name={iconName} 
          size={24} 
          color={isActive ? 'white' : 'rgba(255, 255, 255, 0.7)'} 
        />
        <Text style={[styles.navText, isActive && styles.activeText]}>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.navContainer}>
      <NavItem name="Home" iconName="home" route="Home" />
      <NavItem name="Busca" iconName="search" route="Busca" />
      <NavItem name="Cesta" iconName="basket" route="Cesta" />
      <NavItem name="Perfil" iconName="person" route="Perfil" />
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#004E89', // Fundo azul
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#004175', // Borda um pouco mais escura
    paddingBottom: 10,
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
    flex: 1, // Garante que todos os itens ocupem o mesmo espaço
  },
  navText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)', // Cor inativa branca transparente
  },
  activeText: {
    color: 'white', // Cor ativa branca sólida
    fontWeight: '600',
  },
});

export default BottomNav;