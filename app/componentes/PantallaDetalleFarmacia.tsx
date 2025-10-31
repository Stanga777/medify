import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { styles } from '../estilos/estilos';

interface PantallaDetalleFarmaciaProps {
  onNavigate: (screen: string) => void;
}

export const PantallaDetalleFarmacia: React.FC<PantallaDetalleFarmaciaProps> = ({ onNavigate }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={() => onNavigate('pharmacies')}>
        <Text style={styles.backButton}>← Atrás</Text>
      </TouchableOpacity>
    </View>
    
    <ScrollView>
      <View style={styles.pharmacyImage}>
        <Text style={styles.pharmacyImageIcon}>🏥</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Farmacia Central</Text>
        <Text style={styles.subtitle}>📍 Av. Corrientes 1234</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medicamento</Text>
          <Text style={styles.cardSubtitle}>Ibuprofeno 600mg</Text>
          <Text style={styles.successText}>✓ Disponible</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Horario de Atención</Text>
          <Text style={styles.cardSubtitle}>Lunes a Viernes: 8:00 - 20:00</Text>
          <Text style={styles.cardSubtitle}>Sábados: 9:00 - 14:00</Text>
          <Text style={styles.cardSubtitle}>Domingos: Cerrado</Text>
        </View>
        
        <TouchableOpacity
          onPress={() => onNavigate('confirmation')}
          style={[styles.primaryButton, { marginTop: 24, marginBottom: 24 }]}
        >
          <Text style={styles.primaryButtonText}>Reservar Medicamento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);