// ============================================
// componentes/PantallaAdminFormularioFarmacia.tsx - FIREBASE
// ============================================
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { styles } from '../estilos/estilos';
import { addPharmacy } from '../services/pharmacyService';

interface PantallaAdminFormularioFarmaciaProps {
  onNavigate: (screen: string) => void;
}

export const PantallaAdminFormularioFarmacia: React.FC<PantallaAdminFormularioFarmaciaProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [schedule, setSchedule] = useState('');
  const [distance, setDistance] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !address) {
      Alert.alert('Error', 'Completa al menos el nombre y dirección');
      return;
    }

    try {
      setLoading(true);
      
      const pharmacyId = await addPharmacy({
        name,
        address,
        distance: distance || '0 km',
        phone,
        schedule,
        accepts: true
      });

      if (pharmacyId) {
        Alert.alert(
          'Éxito',
          'Farmacia guardada correctamente',
          [{ text: 'OK', onPress: () => onNavigate('admin-pharmacies') }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar la farmacia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => onNavigate('admin-pharmacies')}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Añadir Farmacia</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre de la Farmacia *</Text>
          <TextInput
            placeholder="Ej: Farmacia Central"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Dirección *</Text>
          <TextInput
            placeholder="Ej: Av. Corrientes 1234"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Distancia</Text>
          <TextInput
            placeholder="Ej: 0.5 km"
            style={styles.input}
            value={distance}
            onChangeText={setDistance}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            placeholder="Ej: +54 11 1234-5678"
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Horarios</Text>
          <TextInput
            placeholder="Lunes a Viernes: 8:00 - 20:00"
            style={styles.input}
            value={schedule}
            onChangeText={setSchedule}
          />
        </View>
        
        <TouchableOpacity
          onPress={handleSave}
          style={styles.primaryButton}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => onNavigate('admin-pharmacies')}
          style={[styles.secondaryButton, { marginTop: 12, marginBottom: 40 }]}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};