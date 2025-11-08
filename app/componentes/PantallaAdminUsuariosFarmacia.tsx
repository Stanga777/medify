import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { styles } from '../estilos/estilos';
import { User } from '../tipos/usuario';
import { getAllUsers } from '../database/userService';

interface PantallaAdminUsuariosFarmaciaProps {
  onNavigate: (screen: string) => void;
}

export const PantallaAdminUsuariosFarmacia: React.FC<PantallaAdminUsuariosFarmaciaProps> = ({ onNavigate }) => {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    const pharmacyUsers = allUsers.filter(u => u.role === 'pharmacy');
    setUsers(pharmacyUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => onNavigate('admin-dashboard')}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Usuarios Farmacia</Text>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity
          onPress={() => onNavigate('admin-create-pharmacy-user')}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>➕ Crear Usuario Farmacia</Text>
        </TouchableOpacity>

        {users.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👥</Text>
            <Text style={styles.emptyStateText}>No hay usuarios de farmacia</Text>
            <Text style={styles.emptyStateSubtext}>Crea el primer usuario</Text>
          </View>
        ) : (
          users.map(user => (
            <View key={user.uid} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{user.name}</Text>
                  <Text style={styles.cardSubtitle}>📧 {user.email}</Text>
                  {user.phone && (
                    <Text style={styles.cardSubtitle}>📞 {user.phone}</Text>
                  )}
                  <Text style={styles.cardSubtitle}>🏥 Farmacia ID: {user.pharmacy_id}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>FARMACIA</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};