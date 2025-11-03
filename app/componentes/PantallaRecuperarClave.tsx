import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../estilos/estilos';

interface PantallaRecuperarClaveProps {
  onNavigate: (screen: string) => void;
  onResetPassword: (email: string) => void;   // ✅ AGREGADA
}

export const PantallaRecuperarClave: React.FC<PantallaRecuperarClaveProps> = ({
  onNavigate,
  onResetPassword
}) => {
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => onNavigate('onboarding')}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recuperar Contraseña</Text>
      </View>

      <View style={styles.centerContainer}>
        <View style={styles.forgotPasswordIcon}>
          <Text style={styles.forgotPasswordIconText}>🔒</Text>
        </View>

        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.forgotPasswordSubtitle}>
          Ingresá tu email y te enviaremos una contraseña temporal
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>

            <TextInput
              placeholder="tu@email.com"
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}    // ✅ GUARDAR INPUT
            />
          </View>

          <TouchableOpacity
            onPress={() => onResetPassword(email)}   // ✅ USAR LA FUNCIÓN REAL
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Enviar Código</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onNavigate('onboarding')} style={{ marginTop: 16 }}>
            <Text style={[styles.link, { textAlign: 'center' }]}>
              Volver al inicio de sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};