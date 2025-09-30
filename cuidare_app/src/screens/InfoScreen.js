import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const InfoScreen = ({ route, navigation }) => {
  // A tela recebe o título e o conteúdo via parâmetros de navegação
  const { title, content } = route.params;

  return (
    <SafeAreaView style={styles.wrapper}>
       <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{width: 28}} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text>{content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: 'white' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#004E89' },
    headerTitle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold' },
    container: { padding: 24 },
});

export default InfoScreen;