import React from 'react';
// ADICIONADO: ActivityIndicator para o loading
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

// ADICIONADO: Props 'style' e 'loading'
const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  style = {}, // Aceita estilos externos (default é um objeto vazio)
  loading = false // Aceita a prop de loading
}) => {

  // MODIFICADO: Passamos um array de 3 estilos:
  // 1. O estilo base (styles.button)
  // 2. O estilo da variante (styles.primary ou styles.secondary)
  // 3. O estilo externo (a prop 'style', ex: { flex: 1 })
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], style]}
      onPress={onPress}
      disabled={loading} // Desativa o botão enquanto está carregando
    >
      {/* ADICIONADO: Lógica para mostrar spinner ou texto */}
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%', // Mantém 100% por padrão (CadastroScreen)
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    // IMPORTANTE: A prop 'style' com 'flex: 1' vai
    // sobrescrever o 'width: 100%' quando necessário (WelcomeScreen)
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  primary: {
    backgroundColor: '#C00021', // Vermelho (Cor que você definiu)
  },
  secondary: {
    backgroundColor: '#0096C7', // Azul (Cor que você definiu)
  },
});

export default CustomButton;