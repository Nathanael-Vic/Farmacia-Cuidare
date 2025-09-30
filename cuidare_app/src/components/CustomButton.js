import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// Nosso botão aceita 3 "propriedades": title, onPress, e variant (variante)
const CustomButton = ({ title, onPress, variant = 'primary' }) => {
  return (
    // Passamos um array de estilos: o estilo base e o estilo da variante
    <TouchableOpacity 
      style={[styles.button, styles[variant]]} 
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Nossas variantes de estilo
  primary: {
    backgroundColor: '#C00021', // Vermelho
  },
  secondary: {
    backgroundColor: '#0096C7', // Azul
  },
});

export default CustomButton;