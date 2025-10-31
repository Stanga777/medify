import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../estilos/estilos';
import { User } from '../tipos/usuario';

interface PantallaInicioSesionProps {
  onNavigate: (screen: string) => void;
  onLogin: (email: string, password: string) => void;
}

export const PantallaInicioSesion: React.FC<PantallaInicioSesionProps> = ({ onNavigate, onLogin }) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = () => {
    onLogin(loginEmail, loginPassword);
    setLoginEmail('');
    setLoginPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.centerContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.title}>Medify</Text>
          <Text style={styles.subtitle}>Tu medicación, sin complicaciones.</Text>
          
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              value={loginEmail}
              onChangeText={setLoginEmail}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Contraseña"
              style={styles.input}
              secureTextEntry
              value={loginPassword}
              onChangeText={setLoginPassword}
            />
            
            <TouchableOpacity onPress={handleLogin} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Continuar con Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Continuar con Apple</Text>
            </TouchableOpacity>
            
            <View style={styles.linkContainer}>
              <TouchableOpacity onPress={() => onNavigate('forgot-password')}>
                <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onNavigate('register')}>
                <Text style={styles.link}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>Usuarios de prueba:</Text>
              <Text style={styles.demoText}>Admin: admin@medify.com / admin123</Text>
              <Text style={styles.demoText}>O crea tu propia cuenta ↗</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};