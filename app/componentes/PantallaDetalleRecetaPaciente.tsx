// ============================================
// componentes/PantallaDetalleRecetaPaciente.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert } from 'react-native';
import { styles } from '../estilos/estilos';
import { Prescription, Pharmacy } from '../tipos/usuario';
import { getPharmacyById } from '../services/pharmacyService';
import { updatePaymentStatus } from '../services/prescriptionService';

interface PantallaDetalleRecetaPacienteProps {
  prescription: Prescription | null;
  onNavigate: (screen: string) => void;
  onPaymentComplete: () => void;
}

export const PantallaDetalleRecetaPaciente: React.FC<PantallaDetalleRecetaPacienteProps> = ({ 
  prescription,
  onNavigate,
  onPaymentComplete
}) => {
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prescription?.pharmacy_id) {
      loadPharmacy();
    }
  }, [prescription]);

  const loadPharmacy = async () => {
    if (prescription?.pharmacy_id) {
      const pharmacyData = await getPharmacyById(prescription.pharmacy_id);
      setPharmacy(pharmacyData);
    }
  };

  if (!prescription) {
    return null;
  }

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      console.log('🔵 Creando preferencia de pago...');
      
      const response = await fetch('http://localhost:3000/api/payment/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prescriptionId: prescription.id,
          price: prescription.price,
          title: `Medicamento: ${prescription.medicine}`
        })
      });

      const data = await response.json();
      console.log('✅ Preferencia creada:', data);

      if (data.init_point) {
        // Abrir MercadoPago
        const paymentWindow = window.open(data.init_point, '_blank');
        
        if (!paymentWindow) {
          Alert.alert('Error', 'No se pudo abrir la ventana de pago. Verifica que no estén bloqueados los pop-ups.');
          setLoading(false);
          return;
        }

        Alert.alert(
          '⏰ Tiempo para pagar',
          'Tienes 2 minutos para completar el pago',
          [{ text: 'OK' }]
        );

        let timeElapsed = 0;
        const maxTime = 2 * 60 * 1000; // 2 minutos en milisegundos
        
        // Verificar cada segundo si la ventana se cerró
        const checkInterval = setInterval(() => {
          timeElapsed += 1000;

          // Si la ventana se cerró (el usuario pagó o canceló)
          if (paymentWindow.closed) {
            clearInterval(checkInterval);
            
            // Preguntar al usuario qué pasó
            setTimeout(() => {
              Alert.alert(
                '¿Completaste el pago?',
                'Por favor indica si el pago fue exitoso',
                [
                  {
                    text: 'No, cancelé',
                    style: 'cancel',
                    onPress: () => {
                      Alert.alert('Pago cancelado', 'Puedes intentar pagar nuevamente cuando quieras');
                    }
                  },
                  {
                    text: 'Sí, pagué',
                    onPress: async () => {
                      // Actualizar el estado del pago en Firebase
                      const success = await updatePaymentStatus(
                        prescription.id,
                        'paid',
                        'manual-' + Date.now(),
                        'mercadopago'
                      );

                      if (success) {
                        Alert.alert(
                          '✅ ¡Pago Confirmado!',
                          'Tu pago ha sido registrado. Ya puedes retirar tu medicamento en la farmacia.',
                          [{ 
                            text: 'OK', 
                            onPress: () => {
                              onPaymentComplete();
                              onNavigate('history');
                            }
                          }]
                        );
                      } else {
                        Alert.alert('Error', 'No se pudo confirmar el pago. Contacta con soporte.');
                      }
                    }
                  }
                ]
              );
            }, 500);
          }
          
          // Si pasaron 2 minutos y la ventana sigue abierta
          if (timeElapsed >= maxTime && !paymentWindow.closed) {
            clearInterval(checkInterval);
            paymentWindow.close();
            
            Alert.alert(
              '⏰ Tiempo agotado',
              'El tiempo para pagar ha expirado. Por favor, intenta nuevamente.',
              [{ text: 'OK' }]
            );
          }
        }, 1000);

      } else {
        Alert.alert('Error', 'No se pudo crear el link de pago');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Error', 'No se pudo procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => onNavigate('history')}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Receta</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Imagen de la receta */}
        {prescription.image_uri && (
          <View style={styles.prescriptionImageContainer}>
            <Image 
              source={{ uri: prescription.image_uri }} 
              style={styles.prescriptionImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Información del medicamento */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información del Medicamento</Text>
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
            <Text style={styles.detailValue}>
              {prescription.status === 'confirmed' ? 'Confirmada' : prescription.status}
            </Text>
          </View>
        </View>

        {/* Información de la farmacia */}
        {pharmacy && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏥 Farmacia</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nombre</Text>
              <Text style={styles.detailValue}>{pharmacy.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dirección</Text>
              <Text style={styles.detailValue}>{pharmacy.address}</Text>
            </View>
            {pharmacy.phone && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Teléfono</Text>
                <Text style={styles.detailValue}>{pharmacy.phone}</Text>
              </View>
            )}
            {pharmacy.schedule && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Horarios</Text>
                <Text style={styles.detailValue}>{pharmacy.schedule}</Text>
              </View>
            )}
          </View>
        )}

        {/* Precio y mensaje */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💰 Información de Pago</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Precio</Text>
            <Text style={[styles.detailValue, { fontSize: 24, fontWeight: 'bold', color: '#10B981' }]}>
              ${prescription.price}
            </Text>
          </View>
          {prescription.confirmation_message && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>💬 Mensaje de la Farmacia</Text>
              <Text style={styles.infoBoxText}>{prescription.confirmation_message}</Text>
            </View>
          )}
        </View>

        {/* Botones de acción */}
        {prescription.payment_status === 'pending' ? (
          <>
            <TouchableOpacity
              onPress={handlePayment}
              style={styles.primaryButton}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Procesando...' : `💳 Pagar $${prescription.price}`}
              </Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>ℹ️ Instrucciones</Text>
              <Text style={styles.infoBoxText}>
                1. Presiona "Pagar" para ir a MercadoPago{'\n'}
                2. Completa el pago en 2 minutos{'\n'}
                3. Confirma que el pago fue exitoso{'\n'}
                4. Retira tu medicamento en la farmacia
              </Text>
            </View>
          </>
        ) : (
          <View style={[styles.card, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.cardTitle, { color: '#059669' }]}>✓ Pago Confirmado</Text>
            <Text style={styles.cardSubtitle}>
              Ya puedes retirar tu medicamento en la farmacia
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => onNavigate('history')}
          style={[styles.secondaryButton, { marginTop: 12, marginBottom: 40 }]}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Volver al Historial</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};