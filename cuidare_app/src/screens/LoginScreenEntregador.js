import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { supabase } from '../lib/supabase'; // Não precisamos mais do Supabase aqui
import CustomButton from '../components/CustomButton';

const LoginScreenEntregador = ({ navigation }) => {
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // --- NOSSA FAKE API ---
    // Isso simula uma chamada de rede com 1.5s de atraso
    async function fakeApiLogin(email, password) {
        console.log("Iniciando chamada FAKE API...");
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Credenciais Falsas (Harcode)
                if (email.toLowerCase() === 'entregador@test.com' && password === '123456') {
                    console.log("FAKE API: Sucesso");
                    // Simula uma resposta de sucesso
                    resolve({ success: true, user: { id: 'fake-user-123', email: email } });
                } else {
                    console.log("FAKE API: Falha");
                    // Simula uma resposta de erro
                    reject(new Error('Credenciais inválidas. (Tente: entregador@test.com / 123456)'));
                }
            }, 1500); // 1.5s de atraso
        });
    }

    async function handleSignIn() {
        if (!email || !password) return Alert.alert('Atenção', 'Preencha o e-mail e a senha.');

        // Bloco try/catch para pegar o 'reject' da nossa API Falsa
        try {
            // ATUALIZADO: Chamando nossa FAKE API
            const response = await fakeApiLogin(email, password);

            // Se a API deu 'resolve' (sucesso)
            if (response.success) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeEntregador' }], // Mude para 'HomeEntregador' se ela existir
                });
            }

        } catch (error) {
            // Se a API deu 'reject' (erro)
            return Alert.alert('Erro no Login', error.message);
        }
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Image
                    // *** TAREFA 1: ÍCONE ATUALIZADO ***
                    source={require('../assets/images/icon-farmacia-entregadores-2.png')}
                    style={styles.headerLogo}
                />

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Login do Entregador</Text>
                    <Text style={styles.subtitle}>Acesse sua conta para gerenciar suas entregas!</Text>

                    {!showEmailForm ? (
                        <View style={styles.optionsContainer}>
                            <CustomButton title="Entrar com Gmail" variant="secondary" onPress={() => { }} />
                            <CustomButton title="Entrar com Facebook" variant="secondary" onPress={() => { }} />
                            <Text style={styles.divider}>ou</Text>
                            <CustomButton title="Entrar com E-mail" variant="primary" onPress={() => setShowEmailForm(true)} />
                        </View>
                    ) : (
                        <View style={styles.formContainer}>
                            <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                            <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
                        </View>
                    )}
                </ScrollView>

                <View style={styles.bottomContainer}>
                    {showEmailForm && (
                        <CustomButton title="Entrar" variant="primary" onPress={handleSignIn} />
                    )}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Não possui conta? <Text style={styles.footerLink} onPress={() => navigation.navigate('CadastroEntregador')}>Cadastre-se</Text>
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Completei os estilos que você mandou cortado
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        paddingHorizontal: 32,
    },
    headerLogo: {
        width: 40,
        height: 40,
        alignSelf: 'flex-start',
        marginTop: 16,
        marginBottom: 24,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#004E89',
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 40,
    },
    optionsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    formContainer: {
        width: '100%',
        alignItems: 'center'
    },
    divider: {
        color: '#ccc',
        marginVertical: 8,
        marginBottom: 24
    },
    input: {
        width: '100%',
        height: 56,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16
    },
    bottomContainer: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    footer: {
        marginTop: 16,
        alignItems: 'center',
    },
    footerText: {
        color: '#888',
        fontWeight: '600'
    },
    footerLink: {
        color: '#0096C7',
        fontWeight: '600'
    },
});

export default LoginScreenEntregador;