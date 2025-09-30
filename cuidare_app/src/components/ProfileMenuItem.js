import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Props: iconName (nome do ícone), text (texto da opção), onPress (função ao clicar)
const ProfileMenuItem = ({ iconName, text, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons name={iconName} size={24} color="#555" style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  icon: {
    marginRight: 16,
  },
  text: {
    flex: 1, // Faz o texto ocupar o espaço disponível e empurra a seta para a direita
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileMenuItem;