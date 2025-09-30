import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import CustomButton from '../components/CustomButton';
import { MaskedTextInput } from "react-native-mask-text";

const CadastroScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [lote, setLote] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleStep1Continue = () => {
    if (!nome || !cpf || !dataNascimento || !telefone) return Alert.alert('Atenção', 'Preencha todos os campos.');
    if (cpf.length !== 11) return Alert.alert('Atenção', 'O CPF deve conter 11 dígitos.');
    if (dataNascimento.length !== 10) return Alert.alert('Atenção', 'A data de nascimento deve estar no formato AAAA-MM-DD.');
    setStep(2);
  };

  const handleStep2Continue = () => {
    if (!cep || !estado || !cidade || !bairro || !lote) return Alert.alert('Atenção', 'Preencha todos os campos de endereço.');
    setStep(3);
  };

  async function handleFinalSignUp() {
    if (!email || !password) return Alert.alert('Atenção', 'Preencha seu e-mail e senha.');
    
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) return Alert.alert('Erro no Cadastro', authError.message);
    if (!authData.user) return Alert.alert('Erro', 'Não foi possível criar o usuário.');

    const userId = authData.user.id;
    
    const { data: enderecoData, error: enderecoError } = await supabase.from('Endereco_Cliente').insert({ CEP: cep, Estado: estado, Cidade: cidade, Bairro: bairro, Lote: lote }).select('IdEndereco').single();
    if (enderecoError) return Alert.alert('Erro ao salvar endereço', enderecoError.message);
    
    const enderecoId = enderecoData.IdEndereco;

    const { error: clienteError } = await supabase.from('Cliente').insert({ CPF: cpf, Nome: nome, Data_Nascimento: dataNascimento, idEndereco_Cliente: enderecoId, id: userId });
    if (clienteError) return Alert.alert('Erro ao salvar cliente', clienteError.message);
    
    const { error: telefoneError } = await supabase.from('TelefoneCliente').insert({ Telefone: telefone, idCliente: cpf });
    if (telefoneError) return Alert.alert('Erro ao salvar telefone', telefoneError.message);

    setStep(4);
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <Image source={require('../assets/images/coracao.png')} style={styles.headerLogo} />
        <Text style={styles.title}>Crie sua Conta</Text>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.formContainer}>
          {step === 1 && (
            <>
              <Text style={styles.subtitle}>Primeiro, seus dados pessoais</Text>
              <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
              <MaskedTextInput mask="999.999.999-99" style={styles.input} placeholder="CPF" value={cpf} onChangeText={(text, rawText) => setCpf(rawText)} keyboardType="numeric" />
              <MaskedTextInput mask="9999-99-99" style={styles.input} placeholder="Data de Nascimento (AAAA-MM-DD)" value={dataNascimento} onChangeText={setDataNascimento} keyboardType="numeric" />
              <MaskedTextInput mask="(99) 99999-9999" style={styles.input} placeholder="Telefone" value={telefone} onChangeText={(text, rawText) => setTelefone(rawText)} keyboardType="phone-pad" />
            </>
          )}
          {step === 2 && (
            <>
              <Text style={styles.subtitle}>Agora, seu endereço</Text>
              <MaskedTextInput mask="99999-999" style={styles.input} placeholder="CEP" value={cep} onChangeText={(text, rawText) => setCep(rawText)} keyboardType="numeric" />
              <TextInput style={styles.input} placeholder="Estado" value={estado} onChangeText={setEstado} />
              <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
              <TextInput style={styles.input} placeholder="Bairro" value={bairro} onChangeText={setBairro} />
              <TextInput style={styles.input} placeholder="Lote / Número / Complemento" value={lote} onChangeText={setLote} />
            </>
          )}
          {step === 3 && (
            <>
              <Text style={styles.subtitle}>Para finalizar, crie seu login</Text>
              <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={styles.input} placeholder="Senha (mínimo 6 caracteres)" secureTextEntry value={password} onChangeText={setPassword} />
            </>
          )}
           {step === 4 && (
            <View style={styles.successContainer}>
              <Text style={styles.subtitle}>Parabéns, sua conta foi criada com sucesso!</Text>
              <Image source={require('../assets/images/conta-criada-imagem.png')} style={styles.successImage} />
              <CustomButton title="Acessar o aplicativo" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })} />
            </View>
          )}
        </ScrollView>
        
        <View style={styles.buttonContainer}>
            {step === 1 && <CustomButton title="Continuar" onPress={handleStep1Continue} />}
            {step === 2 && <CustomButton title="Continuar" onPress={handleStep2Continue} />}
            {step === 3 && <CustomButton title="Finalizar Cadastro" onPress={handleFinalSignUp} />}
            
            {/* NOVO CÓDIGO ADICIONADO ABAIXO */}
            {step < 4 && ( // Mostra o link apenas antes da tela de sucesso
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Já possui conta?{' '}
                        <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
                            Faça login
                        </Text>
                    </Text>
                </View>
            )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: 'white' },
    container: { flex: 1, paddingHorizontal: 32, paddingTop: 16 },
    headerLogo: { width: 40, height: 40, marginBottom: 16, alignSelf: 'flex-start' },
    title: { fontSize: 28, fontWeight: '700', color: '#000', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#004E89', textAlign: 'center', fontWeight: '600', marginBottom: 24 },
    formContainer: { flex: 1 },
    input: { width: '100%', height: 56, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, marginBottom: 16 },
    buttonContainer: { paddingVertical: 20 },
    successContainer: { alignItems: 'center' },
    successImage: { width: 150, height: 150, marginVertical: 40 },
    // NOVOS ESTILOS ADICIONADOS ABAIXO (iguais aos da tela de login)
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

export default CadastroScreen;