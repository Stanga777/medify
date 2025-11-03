import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { styles } from '../estilos/estilos';
import { Pharmacy, UserLocation } from '../tipos/usuario';
import { NavegacionInferior } from './NavegacionInferior';

interface PantallaFarmaciasProps {
  pharmacies: Pharmacy[];
  onNavigate: (screen: string) => void;
}

export const PantallaFarmacias: React.FC<PantallaFarmaciasProps> = ({ pharmacies, onNavigate }) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  // Obtener ubicación del usuario
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'No se puede acceder a tu ubicación');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Error obteniendo ubicación:', error);
      }
    })();
  }, []);

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 
      ? `${Math.round(distance * 1000)}m` 
      : `${distance.toFixed(1)}km`;
  };

  // Abrir en Google Maps para navegación
  const openInMaps = (pharmacy: Pharmacy) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`;
    Linking.openURL(url);
  };

  // Calcular región inicial del mapa
  const getInitialRegion = () => {
    if (userLocation) {
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    
    // Si no hay ubicación del usuario, centrar en Buenos Aires
    return {
      latitude: -34.6037,
      longitude: -58.3816,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => onNavigate('dashboard')}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Farmacias Disponibles</Text>
      </View>
      
      {/* Mapa interactivo */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={getInitialRegion()}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Marcadores de farmacias */}
        {pharmacies.map(pharmacy => (
          <Marker
            key={pharmacy.id}
            coordinate={{
              latitude: pharmacy.latitude,
              longitude: pharmacy.longitude,
            }}
            title={pharmacy.name}
            description={pharmacy.address}
            onPress={() => setSelectedPharmacy(pharmacy)}
            pinColor="#4A90E2"
          />
        ))}
      </MapView>

      {/* Tarjeta de farmacia seleccionada */}
      {selectedPharmacy && (
        <View style={styles.pharmacyCardOverlay}>
          <View style={styles.pharmacyCardContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedPharmacy(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.pharmacyCardName}>{selectedPharmacy.name}</Text>
            <Text style={styles.pharmacyCardAddress}>📍 {selectedPharmacy.address}</Text>
            
            {userLocation && (
              <Text style={styles.pharmacyCardDistance}>
                📏 {calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  selectedPharmacy.latitude,
                  selectedPharmacy.longitude
                )} de distancia
              </Text>
            )}

            {selectedPharmacy.phone && (
              <Text style={styles.pharmacyCardPhone}>📞 {selectedPharmacy.phone}</Text>
            )}

            {selectedPharmacy.schedule && (
              <Text style={styles.pharmacyCardSchedule}>🕐 {selectedPharmacy.schedule}</Text>
            )}

            <View style={styles.pharmacyCardButtons}>
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => openInMaps(selectedPharmacy)}
              >
                <Text style={styles.navigateButtonText}>🧭 Cómo llegar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => onNavigate('pharmacy-detail')}
              >
                <Text style={styles.detailsButtonText}>Ver detalles</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {/* Lista de farmacias */}
      <ScrollView style={styles.pharmacyList}>
        {pharmacies.map(pharmacy => {
          const distance = userLocation 
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                pharmacy.latitude,
                pharmacy.longitude
              )
            : pharmacy.distance;

          return (
            <TouchableOpacity
              key={pharmacy.id}
              onPress={() => setSelectedPharmacy(pharmacy)}
              style={styles.pharmacyCard}
            >
              <View style={styles.pharmacyInfo}>
                <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
                <Text style={styles.pharmacyAddress}>📍 {pharmacy.address}</Text>
                <Text style={styles.pharmacyDistance}>{distance}</Text>
              </View>
              <View style={styles.acceptsBadge}>
                <Text style={styles.acceptsText}>✓ ACEPTA</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <NavegacionInferior screen="pharmacies" onNavigate={onNavigate} />
    </SafeAreaView>
  );
};