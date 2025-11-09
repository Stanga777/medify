// ============================================
// componentes/PantallaAdminUsuariosFarmacia.tsx - FIREBASE
// ============================================
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { styles } from '../estilos/estilos';
import { User } from '../tipos/usuario';

interface PantallaAdminUsuariosFarmaciaProps {
  onNavigate: (screen: string) => void;
}

export const PantallaAdminUsuariosFarmacia: React.FC<PantallaAdminUsuariosFarmaciaProps> = ({ onNavigate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'pharmacy'));
      const querySnapshot = await getDocs(q);
      
      const pharmacyUsers = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as User));
      
      setUsers(pharmacyUsers);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
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

        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Cargando...</Text>
          </View>
        ) : users.length === 0 ? (
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