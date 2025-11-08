// ============================================
// componentes/PantallaAdminDashboard.tsx
// ============================================
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { styles } from '../estilos/estilos';

interface PantallaAdminDashboardProps {
  onNavigate: (screen: string) => void;
}

export const PantallaAdminDashboard: React.FC<PantallaAdminDashboardProps> = ({ onNavigate }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>Panel de Control</Text>
      <Text style={styles.headerSubtitle}>Administrador</Text>
    </View>
    
    <ScrollView style={styles.content}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Recetas Nuevas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#50E3C2' }]}>156</Text>
          <Text style={styles.statLabel}>Usuarios Activos</Text>
        </View>
      </View>
      
      <View style={[styles.card, { marginBottom: 24 }]}>
        <Text style={[styles.statNumber, { color: '#9333EA' }]}>42</Text>
        <Text style={styles.statLabel}>Farmacias Registradas</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      
      <TouchableOpacity onPress={() => onNavigate('admin-pharmacies')} style={styles.adminMenuItem}>
        <Text style={styles.adminMenuIcon}>📍</Text>
        <Text style={styles.adminMenuText}>Gestionar Farmacias</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.adminMenuItem}>
        <Text style={styles.adminMenuIcon}>👤</Text>
        <Text style={styles.adminMenuText}>Ver Usuarios</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.adminMenuItem}>
        <Text style={styles.adminMenuIcon}>📋</Text>
        <Text style={styles.adminMenuText}>Gestionar Recetas</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => onNavigate('logout-confirm')} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  </SafeAreaView>
);