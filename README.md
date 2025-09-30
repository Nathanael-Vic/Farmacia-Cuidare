# 🩺 Cuidare - App de Marketplace de Farmácias

![Cuidare Banner](https://via.placeholder.com/1000x400.png?text=Banner+do+App+Cuidare)  
*(Sugestão: substitua essa imagem por um print bonito da tela principal do app)*

---

## 📖 Sobre o Projeto

O **Cuidare** é um aplicativo móvel de **marketplace de farmácias**, desenvolvido como um projeto acadêmico.  
Ele conecta usuários a diversas farmácias parceiras, permitindo:

- Pesquisar remédios e cosméticos  
- Comparar preços entre farmácias diferentes  
- Realizar compras com carrinho e checkout integrado  

O conceito é parecido com um *“iFood de farmácias”*:  
um produto pode ter **múltiplas ofertas** de diferentes vendedores, e o usuário escolhe a opção mais vantajosa (por preço ou proximidade).  

---

## 🛠️ Tecnologias e Ferramentas

- **Linguagem:** JavaScript  
- **Framework:** React Native  
- **Ambiente:** Expo (build para Android e iOS)  
- **Backend & BaaS:** Supabase  
- **Banco de Dados:** PostgreSQL  
- **Autenticação:** Supabase Auth  
- **Storage:** Supabase Storage (imagens e avatares)  
- **Triggers & Functions:** automação de perfis e decremento de estoque  
- **Navegação:** React Navigation (Stack Navigator)  
- **Estado Global:** Context API (carrinho de compras)  
- **Estilização:** StyleSheet (React Native)  
- **Bibliotecas Extras:**  
  - `react-native-mask-text` → formatação de inputs (CPF, CEP, etc.)  
  - `@expo/vector-icons` → ícones (Ionicons, FontAwesome5)  

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Splash, Boas-vindas, Login e Cadastro  
- Criação de conta em múltiplos passos (cliente, endereço e telefone)  
- Login seguro com Supabase Auth  

### 🏠 Tela Principal (Home)
- Exibe nome e endereço do usuário logado  
- Carrossel de banners promocionais  
- Lista de categorias com filtros pré-selecionados  
- Seção *Mais Vendidos* mostrando produtos do banco  

### 🔎 Busca Inteligente
- Busca de produtos em tempo real  
- Filtros por tipo (*Remédio*, *Cosmético*) e *Promoções*  

### 🛒 Marketplace de Farmácias
- **Detalhes do Produto:** lista de todas as farmácias que vendem o item  
- **Detalhes da Farmácia:** página dedicada, com busca interna  

### 🛍️ Carrinho de Compras
- Adição de produtos de várias farmácias  
- Validação de estoque em tempo real  
- Atualização de quantidade e remoção de itens  

### 💳 Checkout e Pedidos
- Resumo do pedido com endereço  
- Pagamento (Pix, Boleto)  
- Estoque decrementado automaticamente  
- Cancelamento automático de pedidos pendentes (via `pg_cron`)  

### 👤 Gerenciamento de Perfil
- Alterar foto de perfil (via `expo-image-picker`)  
- Editar dados cadastrais  

---

## 🔑 Painel de Administrador Secreto

Acesso escondido para cadastrar dados sem precisar ir ao Supabase manualmente.  

📌 **Como acessar:** clicar **5 vezes** no ícone de coração da **HomeScreen**  

**Funcionalidades:**  
- Cadastrar novo produto (Produto + Remédio)  
- Adicionar estoque (preço e quantidade)  
- Cadastrar nova farmácia  

---

## 🚀 Como Rodar o Projeto

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/cuidare_app.git
cd cuidare_app

# 2. Instale as dependências
npm install

# 3. Configure o Supabase
# Crie o arquivo /src/lib/supabase.js e adicione:
export const supabaseUrl = "SUA_URL_DO_SUPABASE"
export const supabaseAnonKey = "SUA_CHAVE_ANON"

# 4. Rode o app
npm start
