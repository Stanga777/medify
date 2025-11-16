// ============================================
// componentes/PantallaAdminFormularioFarmacia.tsx - FIREBASE UNIFICADO
// ============================================
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { styles } from '../estilos/estilos';
import { addPharmacy } from '../services/pharmacyService';
import { createPharmacyUser } from '../services/authService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

interface PantallaAdminFormularioFarmaciaProps {
  onNavigate: (screen: string) => void;
}

export const PantallaAdminFormularioFarmacia: React.FC<PantallaAdminFormularioFarmaciaProps> = ({ onNavigate }) => {
  // Datos de la farmacia
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [schedule, setSchedule] = useState('');
  const [distance, setDistance] = useState('');
  
  // Datos del usuario de acceso
  const [responsibleName, setResponsibleName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Validaciones de farmacia
    if (!name || !address) {
      Alert.alert('Error', 'Completa al menos el nombre y dirección de la farmacia');
      return;
    }

    // Validaciones de usuario
    if (!responsibleName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Completa todos los datos de acceso del responsable');
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
      
      // 1. Crear la farmacia primero
      const pharmacyId = await addPharmacy({
        name,
        address,
        distance: distance || '0 km',
        phone,
        schedule,
        accepts: true
      });

      if (!pharmacyId) {
        throw new Error('No se pudo crear la farmacia');
      }

      // 2. Crear el usuario de acceso para esta farmacia
      await createPharmacyUser(email, password, responsibleName, pharmacyId, phone);

      Alert.alert(
        '¡Farmacia y Usuario Creados!',
        `Farmacia: ${name}\n\nCredenciales de acceso:\nEmail: ${email}\nContraseña: ${password}\n\nGuarda estas credenciales para entregarlas a la farmacia.`,
        [{ 
          text: 'OK', 
          onPress: () => onNavigate('admin-pharmacies') 
        }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear la farmacia y su usuario');
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
        {/* SECCIÓN: DATOS DE LA FARMACIA */}
        <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Datos de la Farmacia</Text>
        
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

        {/* SECCIÓN: DATOS DEL USUARIO DE ACCESO */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16 }]}>Datos de Acceso</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>ℹ️ Usuario de Acceso</Text>
          <Text style={styles.infoBoxText}>
            Crea las credenciales que la farmacia usará para ingresar al sistema
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre del Responsable *</Text>
          <TextInput
            placeholder="Ej: Juan Pérez"
            style={styles.input}
            value={responsibleName}
            onChangeText={setResponsibleName}
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
        
        <TouchableOpacity
          onPress={handleSave}
          style={styles.primaryButton}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Creando...' : 'Crear Farmacia y Usuario'}
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