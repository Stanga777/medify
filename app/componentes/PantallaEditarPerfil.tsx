// ============================================
// componentes/PantallaEditarPerfil.tsx
// ============================================
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../estilos/estilos';
import { User } from '../tipos/usuario';

interface PantallaEditarPerfilProps {
  currentUser: User | null;
  onNavigate: (screen: string) => void;
  onUpdateProfile: (name: string, phone: string) => void;
}

export const PantallaEditarPerfil: React.FC<PantallaEditarPerfilProps> = ({ 
  currentUser, 
  onNavigate,
  onUpdateProfile 
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    onUpdateProfile(name, phone);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => onNavigate('profile')}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👤</Text>
          </View>
          <Text style={styles.profileEmail}>{currentUser?.email}</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre Completo *</Text>
          <TextInput
            placeholder="Tu nombre"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
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
          <Text style={styles.label}>Email</Text>
          <View style={styles.disabledInput}>
            <Text style={styles.disabledInputText}>{currentUser?.email}</Text>
          </View>
          <Text style={styles.helpText}>El email no se puede modificar</Text>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>💾 Guardar Cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigate('profile')}
          style={[styles.secondaryButton, { marginTop: 12, marginBottom: 40 }]}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};