// ============================================
// componentes/PantallaFarmaciaDetalleReceta.tsx
// ============================================
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert } from 'react-native';
import { styles } from '../estilos/estilos';
import { Prescription, User } from '../tipos/usuario';
import { confirmPrescriptionWithPrice } from '../services/prescriptionService';

interface PantallaFarmaciaDetalleRecetaProps {
  prescription: Prescription | null;
  currentUser: User | null;
  onNavigate: (screen: string) => void;
  onConfirmed: () => void;
}

export const PantallaFarmaciaDetalleReceta: React.FC<PantallaFarmaciaDetalleRecetaProps> = ({ 
  prescription,
  currentUser,
  onNavigate,
  onConfirmed
}) => {
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  if (!prescription) {
    return null;
  }

  const handleConfirm = async () => {
    if (!currentUser?.pharmacy_id) {
      Alert.alert('Error', 'No se pudo identificar la farmacia');
      return;
    }

    const priceNumber = parseFloat(price);
    if (!price || isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert('Error', 'Por favor ingresa un precio válido');
      return;
    }

    Alert.alert(
      'Confirmar Receta',
      `¿Confirmar medicamento disponible por $${priceNumber}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, confirmar',
          onPress: async () => {
            setLoading(true);
            const success = await confirmPrescriptionWithPrice(
              prescription.id,
              currentUser.pharmacy_id!,
              priceNumber,
              message || 'Receta disponible para retiro'
            );

            setLoading(false);

            if (success) {
              Alert.alert(
                '¡Confirmado!',
                'El paciente recibirá una notificación',
                [{ text: 'OK', onPress: () => {
                  onConfirmed();
                  onNavigate('pharmacy-dashboard');
                }}]
              );
            } else {
              Alert.alert('Error', 'No se pudo confirmar la receta');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => onNavigate('pharmacy-pending')}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Receta</Text>
      </View>

      <ScrollView style={styles.content}>
        {prescription.image_uri && (
          <View style={styles.prescriptionImageContainer}>
            <Image 
              source={{ uri: prescription.image_uri }} 
              style={styles.prescriptionImage}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información del Paciente</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nombre</Text>
            <Text style={styles.detailValue}>{prescription.user_name}</Text>
          </View>
          {prescription.user_phone && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Teléfono</Text>
              <Text style={styles.detailValue}>{prescription.user_phone}</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información de la Receta</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Medicamento</Text>
            <Text style={styles.detailValue}>{prescription.medicine}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha</Text>
            <Text style={styles.detailValue}>{prescription.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estado</Text>
            <Text style={styles.detailValue}>{prescription.status}</Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Precio *</Text>
          <TextInput
            placeholder="Ej: 1500"
            style={styles.input}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mensaje para el paciente (opcional)</Text>
          <TextInput
            placeholder="Ej: Disponible en mostrador 3"
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            multiline
            value={message}
            onChangeText={setMessage}
          />
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          style={styles.confirmButton}
          disabled={loading}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? 'Confirmando...' : '✓ Confirmar que tengo esta receta'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigate('pharmacy-pending')}
          style={[styles.secondaryButton, { marginTop: 12, marginBottom: 40 }]}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};