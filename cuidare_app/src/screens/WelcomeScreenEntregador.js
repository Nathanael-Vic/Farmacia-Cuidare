import React from 'react';
import { StyleSheet, View, Image, ImageBackground, Text } from 'react-native';
import CustomButton from '../components/CustomButton';

const WelcomeScreenEntregador = ({ navigation }) => {
    return (
        <ImageBackground
            source={require('../assets/images/imagem-topo-2.png')}
            style={styles.background}
        >
            <View style={styles.overlay}>
                <View style={styles.contentContainer}>
                    <Image
                        source={require('../assets/images/icon-farmacia-entregadores.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.tagline}>
                        Aqui, você realiza entregas de forma fácil e segura!
                    </Text>

                    <View style={styles.actionsContainer}>
                        <CustomButton
                            title="Cadastre-se"
                            variant="primary"
                            // ATUALIZADO: Aponta para a nova rota de cadastro
                            onPress={() => navigation.navigate('CadastroEntregador')}
                        />
                        <CustomButton
                            title="Fazer Login"
                            variant="secondary"
                            // ATUALIZADO: Aponta para a nova rota de login
                            onPress={() => navigation.navigate('LoginEntregador')}
                        />
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1 },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 78, 137, 0.85)',
        justifyContent: 'flex-end',
    },
    contentContainer: { padding: 32, alignItems: 'center' },
    logo: { width: 60, height: 60, marginBottom: 24 },
    tagline: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 32,
        marginBottom: 40,
    },
    actionsContainer: { width: '100%', alignItems: 'center' },
});

export default WelcomeScreenEntregador;