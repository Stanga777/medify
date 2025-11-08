// ============================================
// componentes/PantallaHistorial.tsx
// ============================================
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { styles } from '../estilos/estilos';
import { Prescription } from '../tipos/usuario';
import { NavegacionInferior } from './NavegacionInferior';

interface PantallaHistorialProps {
  prescriptions: Prescription[];
  onNavigate: (screen: string) => void;
}

export const PantallaHistorial: React.FC<PantallaHistorialProps> = ({ prescriptions, onNavigate }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={() => onNavigate('dashboard')}>
        <Text style={styles.backButton}>← Atrás</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Historial de Recetas</Text>
    </View>
    
    <ScrollView style={styles.content}>
      {prescriptions.map(prescription => (
        <View key={prescription.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{prescription.medicine}</Text>
              <Text style={styles.cardSubtitle}>{prescription.date}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{prescription.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
    
    <NavegacionInferior screen="history" onNavigate={onNavigate} />
  </SafeAreaView>
);