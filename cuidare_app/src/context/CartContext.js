import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Lógica de adicionar ao carrinho com validação de estoque atualizado (já estava correta)
  const addToCart = async (productToAdd) => {
    const { data: stockData, error: stockError } = await supabase.from('Estoque').select('Quantidade').eq('idEstoque', productToAdd.idEstoque).single();
    if (stockError || !stockData) { Alert.alert("Erro de Estoque", "Não foi possível verificar o estoque do produto. Tente novamente."); console.error("Erro ao buscar estoque para adição:", stockError); return; }
    const availableStock = stockData.Quantidade;

    setItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === productToAdd.id);
      const currentQuantityInCart = itemExists ? itemExists.quantity : 0;
      if (currentQuantityInCart + 1 > availableStock) { Alert.alert("Estoque Esgotado", `Apenas ${availableStock} unidades disponíveis para este produto.`); return prevItems; }
      Alert.alert("Adicionado!", `${productToAdd.name} foi adicionado à cesta.`);
      if (itemExists) { return prevItems.map(item => item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item); }
      return [...prevItems, { ...productToAdd, quantity: 1, Quantidade: availableStock }];
    });
  };

  // Lógica de atualizar quantidade com validação de estoque atualizado (já estava correta)
  const updateQuantity = async (productId, amount) => {
    const itemToUpdate = items.find(item => item.id === productId);
    if (!itemToUpdate) return;
    const { data: stockData, error: stockError } = await supabase.from('Estoque').select('Quantidade').eq('idEstoque', itemToUpdate.idEstoque).single();
    if (stockError || !stockData) { Alert.alert("Erro de Estoque", "Não foi possível verificar o estoque do produto. Tente novamente."); console.error("Erro ao buscar estoque para atualização:", stockError); return; }
    const availableStock = stockData.Quantidade;

    setItems(prevItems => {
        const newQuantity = itemToUpdate.quantity + amount;
        if (amount > 0 && newQuantity > availableStock) { Alert.alert("Limite de estoque atingido!", `Apenas ${availableStock} unidades disponíveis.`); return prevItems; }
        if (newQuantity <= 0) { return prevItems.filter(item => item.id !== productId); }
        return prevItems.map(item => item.id === productId ? { ...item, quantity: newQuantity, Quantidade: availableStock } : item);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  // NOVA FUNÇÃO: Apenas cria o pedido e pagamento como "Pendente"
  const createPendingOrder = async (paymentMethod, profile, totalPrice) => {
    try {
      if (items.length === 0) throw new Error("A cesta está vazia.");
      
      // Ao inserir, o Supabase usará o DEFAULT now() para preencher o created_at
      const { data: paymentData, error: paymentError } = await supabase.from('Pagamento').insert({ FormaPagamento: paymentMethod, valor: totalPrice, status: 'Pendente' }).select().single();
      if (paymentError) throw paymentError;

      const firstItem = items[0];
      const { data: orderData, error: orderError } = await supabase.from('Pedido').insert({ idCliente: profile.CPF, idFarmacia: firstItem.idFarmacia, idPagamento: paymentData.idPagamento, valor: totalPrice }).select().single();
      if (orderError) throw orderError;
      
      const itemsToInsert = items.map(item => ({ idPedido: orderData.idPedido, idEstoque: item.idEstoque, quantidade: item.quantity, ValorUnitario: item.Preco }));
      const { error: itemsError } = await supabase.from('Item_Pedido').insert(itemsToInsert);
      if (itemsError) throw itemsError;
      
      // Retorna sucesso e o ID do pagamento para a próxima tela
      return { success: true, idPagamento: paymentData.idPagamento };

    } catch (error) {
      Alert.alert("Erro ao criar pedido", error.message);
      return { success: false };
    }
  };

  // NOVA FUNÇÃO: Confirma o pagamento, atualiza o estoque e finaliza
  const confirmPayment = async (idPagamento, navigation) => {
  try {
    // Passo 1: Atualiza o status do pagamento para 'Concluido'
    const { error: paymentError } = await supabase
      .from('Pagamento')
      .update({ status: 'Concluido' })
      .eq('idPagamento', idPagamento);

    if (paymentError) throw paymentError;

    // Passo 2: Encontrar o pedido associado a este pagamento
    const { data: pedidoData, error: pedidoError } = await supabase
      .from('Pedido')
      .select('idPedido')
      .eq('idPagamento', idPagamento)
      .single();

    if (pedidoError) throw pedidoError;
    if (!pedidoData) throw new Error("Pedido não encontrado para este pagamento.");

    const idPedido = pedidoData.idPedido;

    // Passo 3: Buscar todos os itens desse pedido na tabela Itens_Pedido
    const { data: itens, error: itensError } = await supabase
      .from('Item_Pedido')
      .select('idEstoque, quantidade')
      .eq('idPedido', idPedido);

    if (itensError) throw itensError;

    // Passo 4: Iterar sobre cada item e atualizar o estoque
    for (const item of itens) {
      // Pega o estoque atual do item
      const { data: estoqueAtualData, error: fetchError } = await supabase
        .from('Estoque')
        .select('Quantidade')
        .eq('idEstoque', item.idEstoque)
        .single();
      
      if (fetchError) throw fetchError;

      const estoqueAtual = estoqueAtualData.Quantidade;
      const novaQuantidade = estoqueAtual - item.quantidade;

      // Atualiza a tabela Estoque com a nova quantidade
      const { error: updateError } = await supabase
        .from('Estoque')
        .update({ Quantidade: novaQuantidade })
        .eq('idEstoque', item.idEstoque);

      if (updateError) throw updateError;
    }

    // Se tudo deu certo, limpa o carrinho e navega para a tela de sucesso
    clearCart(); // Supondo que você tenha uma função para limpar o carrinho
    navigation.reset({
      index: 0,
      routes: [{ name: 'OrderSuccess' }], // Navega para uma tela de sucesso
    });

  } catch (error) {
    console.error("Erro ao confirmar pagamento e atualizar estoque:", error.message);
    Alert.alert("Erro", "Não foi possível processar seu pedido. Tente novamente.");
    // Opcional: reverter o status do pagamento se a atualização do estoque falhar
  }
};

  const value = {
    items,
    addToCart,
    updateQuantity,
    clearCart,
    createPendingOrder, // Adicionado ao contexto
    confirmPayment,     // Adicionado ao contexto
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.quantity * item.Preco, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};