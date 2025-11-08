// ============================================
// componentes/PantallaFarmaciaRecetasPendientes.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, RefreshControl, Image } from 'react-native';
import { styles } from '../estilos/estilos';
import { Prescription } from '../tipos/usuario';
import { getPendingPrescriptions } from '../database/prescriptionService';

interface PantallaFarmaciaRecetasPendientesProps {
  onNavigate: (screen: string) => void;
  onSelectPrescription: (prescription: Prescription) => void;
}

export const PantallaFarmaciaRecetasPendientes: React.FC<PantallaFarmaciaRecetasPendientesProps> = ({ 
  onNavigate,
  onSelectPrescription
}) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPrescriptions = () => {
    const data = getPendingPrescriptions();
    setPrescriptions(data);
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPrescriptions();
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => onNavigate('pharmacy-dashboard')}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recetas Pendientes</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {prescriptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateText}>No hay recetas pendientes</Text>
            <Text style={styles.emptyStateSubtext}>Las nuevas recetas aparecerán aquí</Text>
          </View>
        ) : (
          prescriptions.map(prescription => (
            <TouchableOpacity
              key={prescription.id}
              onPress={() => onSelectPrescription(prescription)}
              style={styles.prescriptionCard}
            >
              {prescription.image_uri && (
                <Image 
                  source={{ uri: prescription.image_uri }} 
                  style={styles.prescriptionThumbnail}
                />
              )}
              
              <View style={styles.prescriptionInfo}>
                <Text style={styles.prescriptionMedicine}>{prescription.medicine}</Text>
                <Text style={styles.prescriptionPatient}>👤 {prescription.user_name}</Text>
                {prescription.user_phone && (
                  <Text style={styles.prescriptionPhone}>📞 {prescription.user_phone}</Text>
                )}
                <Text style={styles.prescriptionDate}>📅 {prescription.date}</Text>
              </View>

              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>NUEVO</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};