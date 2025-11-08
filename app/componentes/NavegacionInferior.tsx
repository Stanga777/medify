// ============================================
// componentes/NavegacionInferior.tsx
// ============================================
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../estilos/estilos';

interface NavegacionInferiorProps {
  screen: string;
  onNavigate: (screen: string) => void;
}

export const NavegacionInferior: React.FC<NavegacionInferiorProps> = ({ screen, onNavigate }) => (
  <View style={styles.bottomNav}>
    <TouchableOpacity onPress={() => onNavigate('dashboard')} style={styles.navItem}>
      <Text style={[styles.navIcon, screen === 'home' && styles.navIconActive]}>🏠</Text>
      <Text style={[styles.navText, screen === 'home' && styles.navTextActive]}>Inicio</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onNavigate('history')} style={styles.navItem}>
      <Text style={[styles.navIcon, screen === 'history' && styles.navIconActive]}>📋</Text>
      <Text style={[styles.navText, screen === 'history' && styles.navTextActive]}>Historial</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Text style={styles.navIcon}>🔔</Text>
      <Text style={styles.navText}>Avisos</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onNavigate('profile')} style={styles.navItem}>
      <Text style={[styles.navIcon, screen === 'profile' && styles.navIconActive]}>👤</Text>
      <Text style={[styles.navText, screen === 'profile' && styles.navTextActive]}>Perfil</Text>
    </TouchableOpacity>
  </View>
);