import React, { useState, Dispatch, SetStateAction } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';

export interface PantallaRecuperarClaveProps {
  onNavigate: Dispatch<SetStateAction<string>>;
  onResetPassword: (email: string) => Promise<void>;
}

export const PantallaRecuperarClave: React.FC<PantallaRecuperarClaveProps> = ({ onNavigate, onResetPassword }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    try {
      setLoading(true);
      await onResetPassword(email.trim());
      Alert.alert('Enviado', 'Revisa tu correo para restablecer tu contraseña', [
        { text: 'OK', onPress: () => onNavigate('onboarding') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo enviar el email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      {loading ? (
        <ActivityIndicator style={{ marginVertical: 12 }} />
      ) : (
        <>
          <View style={styles.button}>
            <Button title="Enviar correo" onPress={handleSubmit} />
          </View>

          <View style={styles.button}>
            <Button title="Volver" onPress={() => onNavigate('onboarding')} color="#6B7280" />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    textAlign: 'center',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});