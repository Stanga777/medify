import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { styles } from '../estilos/estilos';
import { User } from '../tipos/usuario';
import { NavegacionInferior } from './NavegacionInferior';

interface PantallaDashboardProps {
  currentUser: User | null;
  onNavigate: (screen: string) => void;
}

export const PantallaDashboard: React.FC<PantallaDashboardProps> = ({ currentUser, onNavigate }) => (
  <SafeAreaView style={styles.container}>
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {currentUser?.name || 'Usuario'}</Text>
        <Text style={styles.headerSubtitle}>Gestiona tus medicamentos fácilmente</Text>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity onPress={() => onNavigate('upload')} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>📸 Cargar Nueva Receta</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Pedidos Activos</Text>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Ibuprofeno 600mg</Text>
              <Text style={styles.successText}>✓ Lista para retirar</Text>
              <Text style={styles.cardSubtitle}>Farmacia Central</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ACTIVO</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => onNavigate('confirmation')} style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Ver Detalles</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.content, { marginBottom: 100 }]}>
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity onPress={() => onNavigate('history')} style={styles.quickAction}>
            <Text style={styles.quickActionIcon}>📋</Text>
            <Text style={styles.quickActionText}>Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('pharmacies')} style={styles.quickAction}>
            <Text style={styles.quickActionIcon}>📍</Text>
            <Text style={styles.quickActionText}>Farmacias</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('profile')} style={styles.quickAction}>
            <Text style={styles.quickActionIcon}>👤</Text>
            <Text style={styles.quickActionText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    
    <NavegacionInferior screen="home" onNavigate={onNavigate} />
  </SafeAreaView>
);