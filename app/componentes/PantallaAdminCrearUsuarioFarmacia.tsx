// ============================================
// componentes/PantallaAdminCrearUsuarioFarmacia.tsx - FIREBASE
// ============================================
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { styles } from '../estilos/estilos';
import { Pharmacy } from '../tipos/usuario';
import { getAllPharmacies } from '../services/pharmacyService';
import { createPharmacyUser } from '../services/authService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

interface PantallaAdminCrearUsuarioFarmaciaProps {
  onNavigate: (screen: string) => void;
}

export const PantallaAdminCrearUsuarioFarmacia: React.FC<PantallaAdminCrearUsuarioFarmaciaProps> = ({ onNavigate }) => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPharmacies();
  }, []);

  const loadPharmacies = async () => {
    try {
      const data = await getAllPharmacies();
      setPharmacies(data);
    } catch (error) {
      console.error('Error al cargar farmacias:', error);
    }
  };

  const checkPharmacyHasUser = async (pharmacyId: string): Promise<boolean> => {
    try {
      const q = query(collection(db, 'users'), where('pharmacy_id', '==', pharmacyId));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      return false;
    }
  };

  const handleCreate = async () => {
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

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);

      // Verificar si la farmacia ya tiene usuario
      const hasUser = await checkPharmacyHasUser(selectedPharmacyId);
      if (hasUser) {
        Alert.alert('Error', 'Esta farmacia ya tiene un usuario asignado');
        setLoading(false);
        return;
      }

      // Crear usuario de farmacia
      await createPharmacyUser(email, password, name, selectedPharmacyId, phone);

      Alert.alert(
        '¡Usuario Creado!',
        `Credenciales:\nEmail: ${email}\nContraseña: ${password}\n\nGuarda estas credenciales para entregarlas a la farmacia.`,
        [{ 
          text: 'OK', 
          onPress: () => {
            setName('');
            setEmail('');
            setPhone('');
            setPassword('');
            setConfirmPassword('');
            setSelectedPharmacyId(null);
            onNavigate('admin-pharmacy-users');
          }
        }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear el usuario');
    } finally {
      setLoading(false);
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
            placeholder="Mínimo 6 caracteres"
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
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Creando...' : 'Crear Usuario'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigate('admin-pharmacy-users')}
          style={[styles.secondaryButton, { marginTop: 12, marginBottom: 40 }]}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};