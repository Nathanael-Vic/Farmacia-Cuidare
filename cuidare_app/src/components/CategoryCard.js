import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const CategoryCard = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconBg}>
        <Image source={icon} style={styles.icon} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 110,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginRight: 16,
  },
  iconBg: {
    width: 50,
    height: 50,
    backgroundColor: '#fde8e8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 30,
    height: 30,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
});

export default CategoryCard;