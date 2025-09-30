import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, ScrollView, TouchableOpacity, Modal, FlatList, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

const AdminPanelScreen = ({ navigation }) => {
  const [view, setView] = useState('menu');

  // Estados para formulários
  const [nomeProduto, setNomeProduto] = useState('');
  const [descProduto, setDescProduto] = useState('');
  const [tipoProduto, setTipoProduto] = useState('');
  const [codigoRemedio, setCodigoRemedio] = useState('');
  const [tarja, setTarja] = useState('');
  const [lote, setLote] = useState('');
  const [valorUnidade, setValorUnidade] = useState('');
  const [nomeFarmacia, setNomeFarmacia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [loteEndereco, setLoteEndereco] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [farmaciaSelecionada, setFarmaciaSelecionada] = useState(null);
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [precoAntigo, setPrecoAntigo] = useState('');

  // Estados para listas e modais
  const [produtos, setProdutos] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  // --- INÍCIO DAS NOVAS FUNÇÕES DE FORMATAÇÃO ---

  const handleCnpjChange = (text) => {
    const cleaned = text.replace(/[^\d]/g, ''); // Remove tudo que não for dígito
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    }
    if (cleaned.length > 5) {
      formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    }
    if (cleaned.length > 8) {
      formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`;
    }
    if (cleaned.length > 12) {
      formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
    }
    setCnpj(formatted);
  };

  const handleCepChange = (text) => {
    const cleaned = text.replace(/[^\d]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 5) {
      formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
    }
    setCep(formatted);
  };

  // --- FIM DAS NOVAS FUNÇÕES DE FORMATAÇÃO ---

  useEffect(() => {
    const fetchData = async () => {
      const { data: farmaciasData } = await supabase.from('Farmacia').select('CNPJ, Nome');
      if (farmaciasData) setFarmacias(farmaciasData);
      const { data: produtosData } = await supabase.from('Produto').select('idProduto, Nome');
      if (produtosData) setProdutos(produtosData);
    };
    fetchData();
  }, [view]);

  const handleAddProdutoBase = async () => {
    if (!nomeProduto || !descProduto || !tipoProduto) return Alert.alert('Erro', 'Preencha todos os campos do produto, incluindo o tipo.');

    const { data: produtoData, error: produtoError } = await supabase.from('Produto').insert({ Nome: nomeProduto, Descricao: descProduto, tipo: tipoProduto }).select().single();
    if (produtoError) return Alert.alert('Erro', produtoError.message);

    const idProdutoNovo = produtoData.idProduto;
    if (tipoProduto === 'Remédio') {
      if (!codigoRemedio || !tarja || !lote || !valorUnidade) return Alert.alert('Erro', 'Para remédios, preencha todos os campos específicos.');

      const { error: remedioError } = await supabase.from('Remedio').insert({
        Codigo: codigoRemedio,
        Tarja: tarja,
        Lote: lote,
        Valor_Unidade: parseFloat(valorUnidade),
        idProduto: idProdutoNovo
      });

      if (remedioError) return Alert.alert('Erro ao criar remédio', remedioError.message);
    }
    Alert.alert('Sucesso', 'Novo produto base cadastrado! Agora adicione o estoque.');
    setView('menu');
  };

  const handleAddEstoque = async () => {
    if (!produtoSelecionado || !farmaciaSelecionada || !quantidade || !preco) {
      return Alert.alert('Erro', 'Preencha todos os campos de estoque.');
    }
    const { error } = await supabase.from('Estoque').insert({
      idProduto: produtoSelecionado.idProduto,
      idFarmacia: farmaciaSelecionada.CNPJ,
      Quantidade: parseInt(quantidade),
      Preco: parseFloat(preco),
      Preco_Antigo: precoAntigo ? parseFloat(precoAntigo) : null
    });
    if (error) return Alert.alert('Erro ao adicionar estoque', error.message);
    Alert.alert('Sucesso', 'Estoque adicionado!');
    setView('menu');
  };

  const handleAddFarmacia = async () => {
    // Remove a máscara antes de salvar no banco
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    const cepLimpo = cep.replace(/[^\d]/g, '');

    if (!nomeFarmacia || !cnpjLimpo || !cepLimpo || !estado || !cidade || !bairro || !loteEndereco) {
      return Alert.alert('Erro', 'Preencha todos os campos da farmácia e endereço.');
    }
    const { data: enderecoData, error: enderecoError } = await supabase.from('Endereco_Farmacia').insert({ CEP: cepLimpo, Estado: estado, Cidade: cidade, Bairro: bairro, Lote: loteEndereco }).select().single();
    if (enderecoError) return Alert.alert('Erro ao criar endereço', enderecoError.message);
    const idEnderecoNovo = enderecoData.Id_Endereco;
    const { error: farmaciaError } = await supabase.from('Farmacia').insert({ Nome: nomeFarmacia, CNPJ: cnpjLimpo, idEndereco: idEnderecoNovo });
    if (farmaciaError) return Alert.alert('Erro ao criar farmácia', farmaciaError.message);
    Alert.alert('Sucesso', 'Farmácia cadastrada com sucesso!');
    setView('menu');
  };

  const renderFormContent = (currentView) => {
    if (currentView === 'addProdutoBase') {
      return (
        <>
          <Text style={styles.subtitle}>Cadastrar Novo Produto (Base)</Text>
          <Text style={styles.sectionTitle}>Dados do Produto</Text>
          <TextInput style={styles.input} placeholder="Nome do Produto" value={nomeProduto} onChangeText={setNomeProduto} />
          <TextInput style={styles.input} placeholder="Descrição" value={descProduto} onChangeText={setDescProduto} multiline />
          <Text style={styles.label}>Tipo do Produto</Text>
          <View style={styles.typeSelectorContainer}>
            <TouchableOpacity style={[styles.typeButton, tipoProduto === 'Remédio' && styles.typeButtonActive]} onPress={() => setTipoProduto('Remédio')}><Text style={[styles.typeButtonText, tipoProduto === 'Remédio' && styles.typeButtonTextActive]}>Remédio</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.typeButton, tipoProduto === 'Cosmético' && styles.typeButtonActive]} onPress={() => setTipoProduto('Cosmético')}><Text style={[styles.typeButtonText, tipoProduto === 'Cosmético' && styles.typeButtonTextActive]}>Cosmético</Text></TouchableOpacity>
          </View>
          {tipoProduto === 'Remédio' && (
            <>
              <Text style={styles.sectionTitle}>Dados Específicos do Remédio</Text>
              <TextInput style={styles.input} placeholder="Código (Ex: 789...)" value={codigoRemedio} onChangeText={setCodigoRemedio} keyboardType="numeric" />
              <TextInput style={styles.input} placeholder="Tarja (Ex: Vermelha, Preta)" value={tarja} onChangeText={setTarja} />
              <TextInput style={styles.input} placeholder="Lote" value={lote} onChangeText={setLote} />
              <TextInput style={styles.input} placeholder="Valor Unitário (Ex: 15.50)" value={valorUnidade} onChangeText={setValorUnidade} keyboardType="numeric" />
            </>
          )}
        </>
      );
    }
    if (currentView === 'addEstoque') {
      return (
        <>
          <Text style={styles.subtitle}>Adicionar Estoque</Text>
          <Text style={styles.label}>1. Escolha o Produto</Text>
          <TouchableOpacity style={styles.pickerButton} onPress={() => { setModalContent('produtos'); setIsModalVisible(true); }}>
            <Text style={styles.pickerButtonText}>{produtoSelecionado ? produtoSelecionado.Nome : 'Clique para escolher'}</Text>
            <Ionicons name="chevron-down" size={24} color="#555" />
          </TouchableOpacity>
          <Text style={styles.label}>2. Escolha a Farmácia</Text>
          <TouchableOpacity style={styles.pickerButton} onPress={() => { setModalContent('farmacias'); setIsModalVisible(true); }}>
            <Text style={styles.pickerButtonText}>{farmaciaSelecionada ? farmaciaSelecionada.Nome : 'Clique para escolher'}</Text>
            <Ionicons name="chevron-down" size={24} color="#555" />
          </TouchableOpacity>
          <Text style={styles.label}>3. Detalhes do Estoque</Text>
          <TextInput style={styles.input} placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Preço (Ex: 18.90)" value={preco} onChangeText={setPreco} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Preço Antigo (Opcional)" value={precoAntigo} onChangeText={setPrecoAntigo} keyboardType="numeric" />
        </>
      );
    }
    if (currentView === 'addFarmacia') {
      return (
        <>
          <Text style={styles.subtitle}>Cadastrar Farmácia</Text>
          <Text style={styles.sectionTitle}>Dados da Farmácia</Text>
          <TextInput style={styles.input} placeholder="Nome da Farmácia" value={nomeFarmacia} onChangeText={setNomeFarmacia} />
          {/* --- ALTERAÇÕES NO CNPJ E CEP --- */}
          <TextInput
            style={styles.input}
            placeholder="CNPJ (XX.XXX.XXX/XXXX-XX)"
            value={cnpj}
            onChangeText={handleCnpjChange} // Usa a nova função
            keyboardType="numeric"
            maxLength={18} // Limita o tamanho do campo
          />
          <Text style={styles.sectionTitle}>Endereço da Farmácia</Text>
          <TextInput
            style={styles.input}
            placeholder="CEP (XXXXX-XXX)"
            value={cep}
            onChangeText={handleCepChange} // Usa a nova função
            keyboardType="numeric"
            maxLength={9} // Limita o tamanho do campo
          />
          <TextInput style={styles.input} placeholder="Estado" value={estado} onChangeText={setEstado} />
          <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
          <TextInput style={styles.input} placeholder="Bairro" value={bairro} onChangeText={setBairro} />
          <TextInput style={styles.input} placeholder="Lote / Número" value={loteEndereco} onChangeText={setLoteEndereco} />
        </>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardContainer}>
        <Text style={styles.title}>Painel Secreto</Text>

        {view === 'menu' ? (
          <View style={styles.menu}>
            <CustomButton title="Cadastrar Novo Produto (Base)" onPress={() => setView('addProdutoBase')} />
            <CustomButton title="Adicionar Estoque a Produto" variant="secondary" onPress={() => setView('addEstoque')} />
            <CustomButton title="Cadastrar Nova Farmácia" variant="secondary" onPress={() => setView('addFarmacia')} />
            <View style={{ marginTop: 40 }} >
              <CustomButton title="Voltar para o App" variant="primary" onPress={() => navigation.goBack()} />
            </View>
          </View>
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
              {renderFormContent(view)}
            </ScrollView>
            <View style={styles.buttonContainer}>
              {view === 'addProdutoBase' && <CustomButton title="Salvar Produto Base" onPress={handleAddProdutoBase} />}
              {view === 'addEstoque' && <CustomButton title="Adicionar Estoque" onPress={handleAddEstoque} />}
              {view === 'addFarmacia' && <CustomButton title="Salvar Farmácia" onPress={handleAddFarmacia} />}
              <TouchableOpacity onPress={() => setView('menu')}><Text style={styles.backLink}>Cancelar</Text></TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um Item</Text>
            {modalContent && (
              <FlatList
                data={modalContent === 'farmacias' ? farmacias : produtos}
                keyExtractor={(item) => (item.CNPJ || item.idProduto).toString()} // Adicionado .toString() para segurança
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => {
                    if (modalContent === 'farmacias') setFarmaciaSelecionada(item);
                    else setProdutoSelecionado(item);
                    setIsModalVisible(false);
                  }}>
                    <Text style={styles.modalItemText}>{item.Nome}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum item encontrado.</Text>}
              />
            )}
            <CustomButton title="Fechar" variant="primary" onPress={() => setIsModalVisible(false)} />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: 'white' },
  keyboardContainer: { flex: 1, paddingHorizontal: 32 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 24 },
  subtitle: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#004E89', marginTop: 16, marginBottom: 8, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16 },
  label: { color: '#555', marginBottom: 4, fontWeight: '600' },
  menu: { width: '100%', justifyContent: 'center', flex: 1 },
  formScroll: { flex: 1 },
  input: { width: '100%', height: 56, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, marginBottom: 16 },
  buttonContainer: { paddingTop: 10, paddingBottom: 20 },
  backLink: { color: '#004E89', textAlign: 'center', marginTop: 16, fontWeight: '600', padding: 10 },
  pickerButton: { width: '100%', height: 56, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pickerButtonText: { fontSize: 16, color: '#333' },
  typeSelectorContainer: { flexDirection: 'row', marginBottom: 16 },
  typeButton: { flex: 1, padding: 16, borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#f9f9f9', alignItems: 'center' },
  typeButtonActive: { backgroundColor: '#004E89', borderColor: '#004E89' },
  typeButtonText: { fontSize: 16, fontWeight: '600', color: '#555' },
  typeButtonTextActive: { color: 'white' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, height: '50%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  modalItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalItemText: { fontSize: 18 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#777', marginVertical: 40 }
});

export default AdminPanelScreen;