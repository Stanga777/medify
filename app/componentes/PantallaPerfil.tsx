import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { styles } from '../estilos/estilos';
import { User } from '../tipos/usuario';
import { NavegacionInferior } from './NavegacionInferior';

interface PantallaPerfilProps {
  currentUser: User | null;
  onNavigate: (screen: string) => void;
}

export const PantallaPerfil: React.FC<PantallaPerfilProps> = ({ currentUser, onNavigate }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>Mi Perfil</Text>
    </View>
    
    <ScrollView style={styles.content}>
      <View style={styles.profileCard}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👤</Text>
        </View>
        <Text style={styles.profileName}>{currentUser?.name || 'Usuario'}</Text>
        <Text style={styles.profileEmail}>{currentUser?.email}</Text>
      </View>
      
      <View style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>👤 Editar Información Personal</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>📋 Gestionar Obra Social</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>🔔 Notificaciones</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => onNavigate('logout-confirm')} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
    
    <NavegacionInferior screen="profile" onNavigate={onNavigate} />
  </SafeAreaView>
);