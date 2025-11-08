// ============================================
// componentes/PantallaAdminCrearUsuarioFarmacia.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { styles } from '../estilos/estilos';
import { Pharmacy } from '../tipos/usuario';
import { getAllPharmacies } from '../database/pharmacyService';
import { createPharmacyUser } from '../database/userService';

interface PantallaAdminCrearUsuarioFarmaciaProps {
  onNavigate: (screen: string) => void;
}

export const PantallaAdminCrearUsuarioFarmacia: React.FC<PantallaAdminCrearUsuarioFarmaciaProps> = ({ onNavigate }) => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const data = getAllPharmacies();
    setPharmacies(data);
  }, []);

  const handleCreate = () => {
    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (!selectedPharmacyId) {
      Alert.alert('Error', 'Por favor selecciona una farmacia');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      const success = createPharmacyUser(email, password, name, selectedPharmacyId, phone);

      if (success) {
        Alert.alert(
          '¡Usuario Creado!',
          `Credenciales:\nEmail: ${email}\nContraseña: ${password}\n\nGuarda estas credenciales para entregarlas a la farmacia.`,
          [{ text: 'OK', onPress: () => onNavigate('admin-pharmacy-users') }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear el usuario');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => onNavigate('admin-pharmacy-users')}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Usuario Farmacia</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Seleccionar Farmacia *</Text>
          <View style={styles.pharmacySelectionContainer}>
            {pharmacies.map(pharmacy => (
              <TouchableOpacity
                key={pharmacy.id}
                onPress={() => setSelectedPharmacyId(pharmacy.id)}
                style={[
                  styles.pharmacySelectionCard,
                  selectedPharmacyId === pharmacy.id && styles.pharmacySelectionCardActive
                ]}
              >
                <View style={styles.radioButton}>
                  {selectedPharmacyId === pharmacy.id && <View style={styles.radioButtonInner} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pharmacySelectionName}>{pharmacy.name}</Text>
                  <Text style={styles.pharmacySelectionAddress}>{pharmacy.address}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre del Responsable *</Text>
          <TextInput
            placeholder="Ej: Juan Pérez"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email de Acceso *</Text>
          <TextInput
            placeholder="farmacia@ejemplo.com"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.helpText}>Este será el email para iniciar sesión</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            placeholder="+54 11 1234-5678"
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contraseña *</Text>
          <TextInput
            placeholder="Mínimo 8 caracteres"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirmar Contraseña *</Text>
          <TextInput
            placeholder="Repite la contraseña"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>ℹ️ Importante</Text>
          <Text style={styles.infoBoxText}>
            • Guarda las credenciales para entregarlas a la farmacia{'\n'}
            • La farmacia usará este email y contraseña para ingresar{'\n'}
            • Solo puede haber un usuario por farmacia
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCreate}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Crear Usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigate('admin-pharmacy-users')}
          style={[styles.secondaryButton, { marginTop: 12, marginBottom: 40 }]}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};