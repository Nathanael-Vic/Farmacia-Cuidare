import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// MUDEI O NOME: SplashScreenEntregador
const SplashScreenEntregador = ({ navigation }) => {

    useEffect(() => {
        setTimeout(() => {
            // MUDEI A ROTA: Deve navegar para a Welcome do Entregador
            navigation.replace('WelcomeEntregador');
        }, 3000);
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/images/icon-farmacia-entregadores.png')}
                    style={styles.logoImage}
                />
                <View>
                    <Text style={styles.logoText}>Cuidare</Text>
                    <Text style={styles.logoText}>Entregadores</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

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
        width: 60,
        height: 60,
        marginRight: 16,
    },
    logoText: {
        color: 'white',
        fontSize: 36,
        fontWeight: '700',
        lineHeight: 40,
    },
});

// MUDEI O EXPORT
export default SplashScreenEntregador;