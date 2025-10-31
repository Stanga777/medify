import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { styles } from '../estilos/estilos';
import { Pharmacy } from '../tipos/usuario';

interface PantallaAdminFarmaciasProps {
  pharmacies: Pharmacy[];
  onNavigate: (screen: string) => void;
}

export const PantallaAdminFarmacias: React.FC<PantallaAdminFarmaciasProps> = ({ pharmacies, onNavigate }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={() => onNavigate('admin-dashboard')}>
        <Text style={styles.backButton}>← Atrás</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Gestión de Farmacias</Text>
    </View>
    
    <ScrollView style={styles.content}>
      <TouchableOpacity onPress={() => onNavigate('admin-pharmacy-form')} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>➕ Añadir Nueva Farmacia</Text>
      </TouchableOpacity>
      
      {pharmacies.map(pharmacy => (
        <View key={pharmacy.id} style={styles.adminPharmacyCard}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{pharmacy.name}</Text>
            <Text style={styles.cardSubtitle}>{pharmacy.address}</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate('admin-pharmacy-form')} style={styles.editButton}>
            <Text>✏️</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
);