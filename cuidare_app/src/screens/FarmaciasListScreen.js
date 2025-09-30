import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';

const FarmaciaCard = ({ farmacia, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={{ flex: 1 }}>
            <Text style={styles.farmaciaName}>{farmacia.Nome}</Text>
            <Text style={styles.farmaciaAddress} numberOfLines={1}>
                {`${farmacia.Endereco_Farmacia?.Bairro}, ${farmacia.Endereco_Farmacia?.Cidade}`}
            </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#004E89" />
    </TouchableOpacity>
);

const FarmaciasListScreen = ({ navigation }) => {
    const [farmacias, setFarmacias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarmacias = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('Farmacia')
                .select('*, Endereco_Farmacia(*)');
            
            if (!error) setFarmacias(data || []);
            setLoading(false);
        };
        fetchFarmacias();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.wrapper}>
                <ActivityIndicator style={{ flex: 1 }} size="large" color="#004E89" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} color="white" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Nossos Parceiros</Text>
                <View style={{width: 28}} />
            </View>
            <FlatList
                data={farmacias}
                keyExtractor={(item) => item.CNPJ}
                renderItem={({ item }) => (
                    <FarmaciaCard 
                        farmacia={item} 
                        onPress={() => navigation.navigate('FarmaciaDetail', { farmaciaId: item.CNPJ })}
                    />
                )}
                contentContainerStyle={{padding: 16}}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma farmácia encontrada.</Text>}
            />
            <BottomNav navigation={navigation} activeRoute="" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: 'white' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#004E89' },
    headerTitle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold' },
    card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#eee' },
    farmaciaName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    farmaciaAddress: { fontSize: 14, color: '#777', marginTop: 4 },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#777' },
});

export default FarmaciasListScreen;