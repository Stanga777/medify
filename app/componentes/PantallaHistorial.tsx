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
  onSelectPrescription?: (prescription: Prescription) => void;
}

export const PantallaHistorial: React.FC<PantallaHistorialProps> = ({ 
  prescriptions, 
  onNavigate,
  onSelectPrescription 
}) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={() => onNavigate('dashboard')}>
        <Text style={styles.backButton}>← Atrás</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Historial de Recetas</Text>
    </View>
    
    <ScrollView style={styles.content}>
      {prescriptions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📋</Text>
          <Text style={styles.emptyStateText}>No tienes recetas aún</Text>
          <Text style={styles.emptyStateSubtext}>Sube tu primera receta para comenzar</Text>
        </View>
      ) : (
        prescriptions.map(prescription => (
          <TouchableOpacity
            key={prescription.id}
            onPress={() => onSelectPrescription && onSelectPrescription(prescription)}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{prescription.medicine}</Text>
                <Text style={styles.cardSubtitle}>📅 {prescription.date}</Text>
                
                {/* Mostrar precio si está confirmada */}
                {prescription.status === 'confirmed' && prescription.price > 0 && (
                  <Text style={[styles.cardSubtitle, { color: '#10B981', fontWeight: '600', marginTop: 8 }]}>
                    💰 Precio: ${prescription.price}
                  </Text>
                )}
                
                {/* Mostrar mensaje de confirmación */}
                {prescription.confirmation_message && (
                  <Text style={styles.successText}>
                    💬 {prescription.confirmation_message}
                  </Text>
                )}
                
                {/* Indicador de que es clickeable */}
                {prescription.status === 'confirmed' && (
                  <Text style={[styles.helpText, { marginTop: 8 }]}>
                    Toca para ver detalles y pagar →
                  </Text>
                )}
              </View>
              
              {/* Badge de estado */}
              <View style={
                prescription.status === 'pending' ? styles.pendingBadge :
                prescription.status === 'confirmed' ? styles.confirmedBadge :
                styles.badge
              }>
                <Text style={
                  prescription.status === 'pending' ? styles.pendingBadgeText :
                  prescription.status === 'confirmed' ? styles.confirmedBadgeText :
                  styles.badgeText
                }>
                  {prescription.status === 'pending' ? 'PENDIENTE' :
                   prescription.status === 'confirmed' ? 'CONFIRMADA' :
                   prescription.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
    
    <NavegacionInferior screen="history" onNavigate={onNavigate} />
  </SafeAreaView>
);