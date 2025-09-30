import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// 'ImagePicker' não é mais necessário, então foi removido
import { supabase } from '../lib/supabase';
import ProfileMenuItem from '../components/ProfileMenuItem';
import BottomNav from '../components/BottomNav';
import { Ionicons } from '@expo/vector-icons';

const PerfilScreen = ({ navigation }) => {
  // REMOVIDO: O estado 'imageUri' não é mais necessário
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: clienteData, error } = await supabase
          .from('Cliente')
          .select('Nome')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil do cliente:', error.message);
        }

        // CORREÇÃO: Define o perfil de qualquer maneira.
        // Se 'clienteData' existir, usa o nome de lá.
        // Se não, usa um texto padrão "Seu Nome".
        // O e-mail sempre vem do objeto 'user' da autenticação.
        setProfile({
          nome: clienteData?.Nome || 'Seu Nome',
          email: user.email,
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // REMOVIDO: A função 'pickImage' inteira foi retirada.

  const SectionHeader = ({ title }) => (<View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{title}</Text></View>);

  const privacyPolicyText = `Política de Privacidade do Cuidare\n\nÚltima atualização: 28 de setembro de 2025\n\n...`;
  const securityText = `Segurança e Privacidade no Cuidare\n\nSua confiança é a nossa prioridade...\n\n...`;

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <Image source={require('../assets/images/coracao.png')} style={styles.headerIcon} />
      </View>

      <ScrollView>
        {loading ? (<ActivityIndicator size="large" color="#004E89" style={{ marginTop: 50 }} />) : (
          <>
            <View style={styles.userInfoCard}>
              {/* CORREÇÃO: Removido o TouchableOpacity e a lógica de troca de imagem */}
              <Image
                source={require('../assets/images/profile-placeholder.png')}
                style={styles.profilePicture}
              />
              <View>
                {/* Esta parte agora sempre funcionará por causa da correção acima */}
                <Text style={styles.userName}>{profile?.nome || 'Nome do Usuário'}</Text>
                <Text style={styles.userEmail}>{profile?.email || 'email@exemplo.com'}</Text>
              </View>
            </View>

            <View style={styles.menuContainer}>
              <SectionHeader title="Conta" />
              <View style={styles.notificationItem}>
                <Ionicons name="notifications" size={24} color="#555" style={{ marginRight: 16 }} />
                <Text style={styles.notificationText}>Notificações</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#004E89" }}
                  thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
                  onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
                  value={notificationsEnabled}
                />
              </View>
              <ProfileMenuItem iconName="person" text="Gerencie sua conta" onPress={() => navigation.navigate('EditProfile')} />
              <ProfileMenuItem iconName="shield-checkmark" text="Segurança e Privacidade" onPress={() => navigation.navigate('Info', { title: 'Segurança e Privacidade', content: securityText })} />

              <SectionHeader title="Suporte" />
              <ProfileMenuItem iconName="document-text" text="Políticas de Privacidade" onPress={() => navigation.navigate('Info', { title: 'Políticas de Privacidade', content: privacyPolicyText })} />
            </View>
          </>
        )}
      </ScrollView>

      <BottomNav navigation={navigation} activeRoute="Perfil" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#004E89',
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  headerIcon: { width: 28, height: 28 },
  userInfoCard: {
    flexDirection: 'row', alignItems: 'center', padding: 24, backgroundColor: 'white',
  },
  profilePicture: {
    width: 60, height: 60, borderRadius: 30, marginRight: 16,
    backgroundColor: '#e0e0e0',
  },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 14, color: '#777' },
  menuContainer: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    backgroundColor: '#f0f2f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: -16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionHeaderText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  notificationText: {
    flex: 1,
    fontSize: 16,
    color: '#333'
  },
});

export default PerfilScreen;