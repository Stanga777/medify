import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../estilos/estilos';

interface PantallaRecuperarClaveProps {
  onNavigate: (screen: string) => void;
}

export const PantallaRecuperarClave: React.FC<PantallaRecuperarClaveProps> = ({ onNavigate }) => (
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
        No te preocupes, ingresa tu email y te enviaremos un código para recuperarla
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput placeholder="tu@email.com" style={styles.input} keyboardType="email-address" />
        </View>

        <TouchableOpacity
          onPress={() => {
            Alert.alert('Código Enviado', 'Revisa tu email para continuar');
            onNavigate('onboarding');
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Enviar Código</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onNavigate('onboarding')} style={{ marginTop: 16 }}>
          <Text style={[styles.link, { textAlign: 'center' }]}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
);