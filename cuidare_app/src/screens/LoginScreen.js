import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import CustomButton from '../components/CustomButton';

const LoginScreen = ({ navigation }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  // A CORREÇÃO ESTÁ AQUI 👇
  const [password, setPassword] = useState(''); // CORRIGIDO: Era 'useState'

  async function handleSignIn() {
    if (!email || !password) return Alert.alert('Atenção', 'Preencha o e-mail e a senha.');

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return Alert.alert('Erro no Login', error.message);
    }
    
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Image
            source={require('../assets/images/coracao.png')}
            style={styles.headerLogo}
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Acesse sua conta e aproveite as promoções de nossos parceiros!</Text>

            {!showEmailForm ? (
                <View style={styles.optionsContainer}>
                    <CustomButton title="Entrar com Gmail" variant="secondary" onPress={() => {}} />
                    <CustomButton title="Entrar com Facebook" variant="secondary" onPress={() => {}} />
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
                    Não possui conta? <Text style={styles.footerLink} onPress={() => navigation.navigate('Cadastro')}>Cadastre-se</Text>
                </Text>
            </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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

export default LoginScreen;