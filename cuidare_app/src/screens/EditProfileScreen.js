import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
// 1. Importamos o componente de máscara
import { MaskedTextInput } from "react-native-mask-text";

const EditProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState({});
  const [initialData, setInitialData] = useState({}); // Guarda os dados originais para comparação

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: clienteData, error } = await supabase
            .from('Cliente')
            .select('*, Endereco_Cliente(*), TelefoneCliente(*)')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;

          if (clienteData) {
            const initial = {
                nome: clienteData.Nome,
                cpf: clienteData.CPF,
                dataNascimento: clienteData.Data_Nascimento,
                telefone: clienteData.TelefoneCliente[0]?.Telefone || '',
                endereco: clienteData.Endereco_Cliente || {},
            };
            // Guardamos os dados iniciais e populamos os campos
            setInitialData(initial);
            setNome(initial.nome);
            setCpf(initial.cpf);
            setDataNascimento(initial.dataNascimento);
            setTelefone(initial.telefone);
            setEndereco(initial.endereco);
          }
        }
      } catch (error) {
        Alert.alert('Erro ao carregar perfil', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFullProfile();
  }, []);

  // 2. NOVA FUNÇÃO PARA SALVAR AS ALTERAÇÕES
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não encontrado.");

        // Atualiza a tabela Cliente se o nome ou data de nascimento mudou
        if(nome !== initialData.nome || dataNascimento !== initialData.dataNascimento) {
            const { error: clienteError } = await supabase
                .from('Cliente')
                .update({ Nome: nome, Data_Nascimento: dataNascimento })
                .eq('id', user.id);
            if(clienteError) throw clienteError;
        }
        
        // Atualiza a tabela TelefoneCliente se o telefone mudou
        if(telefone !== initialData.telefone) {
            const { error: telefoneError } = await supabase
                .from('TelefoneCliente')
                .update({ Telefone: telefone })
                .eq('idCliente', cpf); // Usa o CPF para encontrar o telefone correto
            if(telefoneError) throw telefoneError;
        }
        
        // Atualiza a tabela Endereco_Cliente se o endereço mudou
        if(JSON.stringify(endereco) !== JSON.stringify(initialData.endereco)) {
            const { error: enderecoError } = await supabase
                .from('Endereco_Cliente')
                .update(endereco)
                .eq('IdEndereco', initialData.endereco.IdEndereco);
            if(enderecoError) throw enderecoError;
        }

        Alert.alert("Sucesso", "Seu perfil foi atualizado!");
        navigation.goBack();

    } catch (error) {
        Alert.alert("Erro ao salvar", error.message);
    } finally {
        setLoading(false);
    }
  };


  if (loading) {
    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.centered}><ActivityIndicator size="large" color="#004E89" /></View>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} color="white" /></TouchableOpacity>
          <Text style={styles.headerTitle}>Gerenciar Conta</Text>
          <View style={{width: 28}} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />
          <Text style={styles.label}>CPF (não pode ser alterado)</Text>
          <TextInput style={[styles.input, styles.inputDisabled]} value={cpf} editable={false} />
          <Text style={styles.label}>Data de Nascimento</Text>
          {/* 3. USANDO A MÁSCARA PARA DATA E TELEFONE */}
          <MaskedTextInput mask="9999-99-99" style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} keyboardType="numeric" />
          <Text style={styles.label}>Telefone</Text>
          <MaskedTextInput mask="(99) 99999-9999" style={styles.input} value={telefone} onChangeText={(text, rawText) => setTelefone(rawText)} keyboardType="phone-pad" />
          
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Text style={styles.label}>CEP</Text>
          <MaskedTextInput mask="99999-999" style={styles.input} value={endereco.CEP || ''} onChangeText={(text, rawText) => setEndereco({...endereco, CEP: rawText})} keyboardType="numeric" />
          <Text style={styles.label}>Cidade</Text>
          <TextInput style={styles.input} value={endereco.Cidade || ''} onChangeText={(text) => setEndereco({...endereco, Cidade: text})} />
          <Text style={styles.label}>Estado</Text>
          <TextInput style={styles.input} value={endereco.Estado || ''} onChangeText={(text) => setEndereco({...endereco, Estado: text})} />
          <Text style={styles.label}>Bairro</Text>
          <TextInput style={styles.input} value={endereco.Bairro || ''} onChangeText={(text) => setEndereco({...endereco, Bairro: text})} />
          <Text style={styles.label}>Lote / Número</Text>
          <TextInput style={styles.input} value={endereco.Lote || ''} onChangeText={(text) => setEndereco({...endereco, Lote: text})} />
        </ScrollView>
        
        <View style={styles.buttonContainer}>
            {/* 4. BOTÃO AGORA CHAMA A FUNÇÃO DE ATUALIZAR */}
            <CustomButton title="Salvar Alterações" onPress={handleUpdateProfile} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: 'white' },
    keyboardContainer: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#004E89' },
    headerTitle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold' },
    scrollContent: { padding: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
    label: { fontSize: 14, color: '#555', marginBottom: 4, fontWeight: '600' },
    input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, marginBottom: 16, backgroundColor: '#f9f9f9' },
    inputDisabled: {
        backgroundColor: '#e9ecef',
        color: '#6c757d',
    },
    buttonContainer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: 'white',
    },
});

export default EditProfileScreen;