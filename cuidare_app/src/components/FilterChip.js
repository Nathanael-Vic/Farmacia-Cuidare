import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const FilterChip = ({ label, isActive, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.chip, isActive ? styles.activeChip : styles.inactiveChip]}
      onPress={onPress}
    >
      <Text style={isActive ? styles.activeText : styles.inactiveText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  activeChip: { backgroundColor: '#004E89', borderColor: '#004E89' },
  inactiveChip: { backgroundColor: 'white', borderColor: '#ccc' },
  activeText: { color: 'white', fontWeight: 'bold' },
  inactiveText: { color: '#555' },
});

export default FilterChip;