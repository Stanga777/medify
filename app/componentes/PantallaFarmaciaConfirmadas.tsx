// ============================================
// componentes/PantallaFarmaciaConfirmadas.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, RefreshControl, Alert } from 'react-native';
import { styles } from '../estilos/estilos';
import { Prescription, User } from '../tipos/usuario';
import { getPharmacyPrescriptions, markPrescriptionDelivered } from '../services/prescriptionService';

interface PantallaFarmaciaConfirmadasProps {
  currentUser: User | null;
  onNavigate: (screen: string) => void;
}

export const PantallaFarmaciaConfirmadas: React.FC<PantallaFarmaciaConfirmadasProps> = ({ 
  currentUser,
  onNavigate
}) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPrescriptions = async () => {
    if (currentUser?.pharmacy_id) {
      const data = await getPharmacyPrescriptions(currentUser.pharmacy_id);
      const confirmed = data.filter(p => p.status === 'confirmed');
      setPrescriptions(confirmed);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, [currentUser]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrescriptions();
    setRefreshing(false);
  };

  const handleMarkDelivered = (prescriptionId: string) => {
    Alert.alert(
      'Marcar como Entregada',
      '¿El paciente ya retiró esta receta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, entregada',
          onPress: async () => {
            const success = await markPrescriptionDelivered(prescriptionId);
            if (success) {
              Alert.alert('¡Listo!', 'Receta marcada como entregada');
              await loadPrescriptions();
            } else {
              Alert.alert('Error', 'No se pudo marcar como entregada');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => onNavigate('pharmacy-dashboard')}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Confirmaciones</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {prescriptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>✅</Text>
            <Text style={styles.emptyStateText}>No hay recetas confirmadas</Text>
          </View>
        ) : (
          prescriptions.map(prescription => (
            <View key={prescription.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{prescription.medicine}</Text>
                  <Text style={styles.cardSubtitle}>👤 {prescription.user_name}</Text>
                  {prescription.user_phone && (
                    <Text style={styles.cardSubtitle}>📞 {prescription.user_phone}</Text>
                  )}
                  <Text style={styles.cardSubtitle}>📅 {prescription.date}</Text>
                  {prescription.confirmation_message && (
                    <Text style={styles.successText}>💬 {prescription.confirmation_message}</Text>
                  )}
                </View>
                <View style={styles.confirmedBadge}>
                  <Text style={styles.confirmedBadgeText}>CONFIRMADA</Text>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={() => handleMarkDelivered(prescription.id)}
                style={styles.deliverButton}
              >
                <Text style={styles.deliverButtonText}>📦 Marcar como Entregada</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};