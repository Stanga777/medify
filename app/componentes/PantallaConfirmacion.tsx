// ============================================
// componentes/PantallaConfirmacion.tsx
// ============================================
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { styles } from '../estilos/estilos';

interface PantallaConfirmacionProps {
  onNavigate: (screen: string) => void;
}

export const PantallaConfirmacion: React.FC<PantallaConfirmacionProps> = ({ onNavigate }) => (
  <SafeAreaView style={styles.container}>
    <ScrollView>
      <View style={styles.confirmationHeader}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>
        <Text style={styles.confirmationTitle}>¡Reserva Exitosa!</Text>
        <Text style={styles.confirmationSubtitle}>Tu medicamento está listo para retirar</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>Código de Retiro</Text>
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrIcon}>⬜</Text>
          </View>
          <Text style={styles.qrText}>Muestra este código en la farmacia</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalles</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Medicamento</Text>
            <Text style={styles.detailValue}>Ibuprofeno 600mg</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Farmacia</Text>
            <Text style={styles.detailValue}>Farmacia Central</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha</Text>
            <Text style={styles.detailValue}>Hoy, 14:30</Text>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => onNavigate('dashboard')}
          style={[styles.primaryButton, { marginBottom: 24 }]}
        >
          <Text style={styles.primaryButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);