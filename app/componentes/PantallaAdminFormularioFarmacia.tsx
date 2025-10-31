import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { styles } from '../estilos/estilos';

interface PantallaAdminFormularioFarmaciaProps {
  onNavigate: (screen: string) => void;
}

export const PantallaAdminFormularioFarmacia: React.FC<PantallaAdminFormularioFarmaciaProps> = ({ onNavigate }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={() => onNavigate('admin-pharmacies')}>
        <Text style={styles.backButton}>← Atrás</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Añadir Farmacia</Text>
    </View>
    
    <ScrollView style={styles.content}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre de la Farmacia</Text>
        <TextInput placeholder="Ej: Farmacia Central" style={styles.input} />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Dirección</Text>
        <TextInput placeholder="Ej: Av. Corrientes 1234" style={styles.input} />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput placeholder="Ej: +54 11 1234-5678" style={styles.input} keyboardType="phone-pad" />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Horarios</Text>
        <TextInput placeholder="Lunes a Viernes: 8:00 - 20:00" style={styles.input} />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Obras Sociales Aceptadas</Text>
        <View style={styles.checkboxGroup}>
          <TouchableOpacity style={styles.checkbox}>
            <Text>☑️ OSDE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkbox}>
            <Text>☑️ Swiss Medical</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkbox}>
            <Text>☐ Galeno</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        onPress={() => {
          Alert.alert('Éxito', 'Farmacia guardada correctamente');
          onNavigate('admin-pharmacies');
        }}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => onNavigate('admin-pharmacies')}
        style={[styles.secondaryButton, { marginTop: 12, marginBottom: 40 }]}
      >
        <Text style={styles.secondaryButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  </SafeAreaView>
);