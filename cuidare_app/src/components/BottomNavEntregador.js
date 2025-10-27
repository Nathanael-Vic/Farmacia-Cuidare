import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Nome do componente alterado
const BottomNavEntregador = ({ navigation, activeRoute }) => {

    const NavItem = ({ name, iconName, route }) => {
        const isActive = activeRoute === route;
        return (
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => {
                    if (route && !isActive) navigation.navigate(route);
                }}
            >
                <Ionicons
                    name={iconName}
                    size={24}
                    color={isActive ? 'white' : 'rgba(255, 255, 255, 0.7)'}
                />
                <Text style={[styles.navText, isActive && styles.activeText]}>{name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.navContainer}>
            {/* Ícones atualizados para o fluxo de entregador */}
            <NavItem name="Home" iconName="home" route="HomeEntregador" />
            <NavItem name="Ganhos" iconName="cash" route="Ganhos" />
            <NavItem name="Perfil" iconName="person" route="PerfilEntregador" />
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row',
        // Ajuste de altura para acomodar o 'safe area' no iOS
        height: Platform.OS === 'ios' ? 90 : 70,
        backgroundColor: '#C00021', // ATUALIZADO: Cor vermelha (do seu CustomButton)
        justifyContent: 'space-around',
        alignItems: 'flex-start', // Alinha no topo para o padding funcionar
        borderTopWidth: 1,
        borderTopColor: '#A0001A', // ATUALIZADO: Vermelho mais escuro
        paddingTop: 10, // Padding no topo ao invés de 'paddingBottom'
    },
    navItem: {
        alignItems: 'center',
        gap: 2,
        flex: 1,
    },
    navText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    activeText: {
        color: 'white',
        fontWeight: '600',
    },
});

export default BottomNavEntregador;