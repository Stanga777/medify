// ============================================
// componentes/PantallaAdminFarmacias.tsx - FIREBASE
// ============================================
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { styles } from '../estilos/estilos';
import { Pharmacy } from '../tipos/usuario';
import { getAllPharmacies } from '../services/pharmacyService';

interface PantallaAdminFarmaciasProps {
  pharmacies: Pharmacy[];
  onNavigate: (screen: string) => void;
}

export const PantallaAdminFarmacias: React.FC<PantallaAdminFarmaciasProps> = ({ pharmacies, onNavigate }) => {
  const [localPharmacies, setLocalPharmacies] = useState<Pharmacy[]>(pharmacies);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAllPharmacies();
      setLocalPharmacies(data);
    } catch (error) {
      console.error('Error al recargar farmacias:', error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    setLocalPharmacies(pharmacies);
  }, [pharmacies]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => onNavigate('admin-dashboard')}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Farmacias</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <TouchableOpacity
          onPress={() => onNavigate('admin-pharmacy-form')}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>➕ Añadir Nueva Farmacia</Text>
        </TouchableOpacity>
        
        {localPharmacies.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🏥</Text>
            <Text style={styles.emptyStateText}>No hay farmacias registradas</Text>
            <Text style={styles.emptyStateSubtext}>Crea la primera farmacia</Text>
          </View>
        ) : (
          localPharmacies.map(pharmacy => (
            <View key={pharmacy.id} style={styles.adminPharmacyCard}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{pharmacy.name}</Text>
                <Text style={styles.cardSubtitle}>{pharmacy.address}</Text>
              </View>
              <TouchableOpacity
                onPress={() => onNavigate('admin-pharmacy-form')}
                style={styles.editButton}
              >
                <Text>✏️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};