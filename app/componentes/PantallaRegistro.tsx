// ============================================
// componentes/PantallaRegistro.tsx
// ============================================
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../estilos/estilos';

interface PantallaRegistroProps {
  onNavigate: (screen: string) => void;
  onRegister: (name: string, email: string, phone: string, password: string, confirmPassword: string) => void;
}

export const PantallaRegistro: React.FC<PantallaRegistroProps> = ({ onNavigate, onRegister }) => {
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const handleRegister = () => {
    onRegister(registerName, registerEmail, registerPhone, registerPassword, registerConfirmPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => onNavigate('onboarding')}>
            <Text style={styles.backButton}>← Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear Cuenta</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>Completa tus datos para registrarte</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre Completo *</Text>
            <TextInput
              placeholder="Ej: Juan Pérez"
              style={styles.input}
              value={registerName}
              onChangeText={setRegisterName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              placeholder="tu@email.com"
              style={styles.input}
              keyboardType="email-address"
              value={registerEmail}
              onChangeText={setRegisterEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              placeholder="+54 11 1234-5678"
              style={styles.input}
              keyboardType="phone-pad"
              value={registerPhone}
              onChangeText={setRegisterPhone}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contraseña *</Text>
            <TextInput
              placeholder="Mínimo 8 caracteres"
              style={styles.input}
              secureTextEntry
              value={registerPassword}
              onChangeText={setRegisterPassword}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirmar Contraseña *</Text>
            <TextInput
              placeholder="Repite tu contraseña"
              style={styles.input}
              secureTextEntry
              value={registerConfirmPassword}
              onChangeText={setRegisterConfirmPassword}
            />
          </View>

          <TouchableOpacity onPress={handleRegister} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Registrarse</Text>
          </TouchableOpacity>

          <View style={styles.registerLink}>
            <Text style={styles.registerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => onNavigate('onboarding')}>
              <Text style={styles.link}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};