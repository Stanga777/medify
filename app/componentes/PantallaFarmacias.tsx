// ============================================
// componentes/PantallaFarmacias.tsx
// ============================================
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { styles } from '../estilos/estilos';
import { Pharmacy } from '../tipos/usuario';
import { NavegacionInferior } from './NavegacionInferior';

interface PantallaFarmaciasProps {
  pharmacies: Pharmacy[];
  onNavigate: (screen: string) => void;
}

export const PantallaFarmacias: React.FC<PantallaFarmaciasProps> = ({ pharmacies, onNavigate }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={() => onNavigate('dashboard')}>
        <Text style={styles.backButton}>← Atrás</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Farmacias Disponibles</Text>
    </View>
    
    <View style={styles.mapPlaceholder}>
      <Text style={styles.mapIcon}>🗺️</Text>
      <Text style={styles.mapText}>Mapa Interactivo</Text>
    </View>
    
    <ScrollView style={styles.pharmacyList}>
      {pharmacies.map(pharmacy => (
        <TouchableOpacity
          key={pharmacy.id}
          onPress={() => onNavigate('pharmacy-detail')}
          style={styles.pharmacyCard}
        >
          <View style={styles.pharmacyInfo}>
            <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
            <Text style={styles.pharmacyAddress}>📍 {pharmacy.address}</Text>
            <Text style={styles.pharmacyDistance}>{pharmacy.distance}</Text>
          </View>
          <View style={styles.acceptsBadge}>
            <Text style={styles.acceptsText}>✓ ACEPTA</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
    
    <NavegacionInferior screen="pharmacies" onNavigate={onNavigate} />
  </SafeAreaView>
);