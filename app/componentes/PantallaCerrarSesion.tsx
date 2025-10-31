import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../estilos/estilos';

interface PantallaCerrarSesionProps {
  userType: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export const PantallaCerrarSesion: React.FC<PantallaCerrarSesionProps> = ({ userType, onNavigate, onLogout }) => (
  <View style={styles.overlay}>
    <View style={styles.logoutModal}>
      <Text style={styles.logoutModalTitle}>¿Cerrar Sesión?</Text>
      <Text style={styles.logoutModalText}>¿Estás seguro que deseas cerrar sesión?</Text>

      <View style={styles.logoutModalButtons}>
        <TouchableOpacity
          onPress={() => onNavigate(userType === 'admin' ? 'admin-dashboard' : 'profile')}
          style={styles.logoutCancelButton}
        >
          <Text style={styles.logoutCancelText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogout} style={styles.logoutConfirmButton}>
          <Text style={styles.logoutConfirmText}>Sí, cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default PantallaCerrarSesion;