// ============================================
// componentes/PantallaFarmaciaDashboard.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { styles } from '../estilos/estilos';
import { User } from '../tipos/usuario';
import { getPharmacyStats } from '../database/prescriptionService';

interface PantallaFarmaciaDashboardProps {
  currentUser: User | null;
  onNavigate: (screen: string) => void;
}

export const PantallaFarmaciaDashboard: React.FC<PantallaFarmaciaDashboardProps> = ({ 
  currentUser, 
  onNavigate 
}) => {
  const [stats, setStats] = useState({ pendingGlobal: 0, confirmedByMe: 0, deliveredByMe: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = () => {
    if (currentUser?.pharmacy_id) {
      const newStats = getPharmacyStats(currentUser.pharmacy_id);
      setStats(newStats);
    }
  };

  useEffect(() => {
    loadStats();
  }, [currentUser]);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Panel Farmacia</Text>
        <Text style={styles.headerSubtitle}>{currentUser?.name}</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Estadísticas */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.pendingGlobal}</Text>
            <Text style={styles.statLabel}>Recetas Nuevas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.confirmedByMe}</Text>
            <Text style={styles.statLabel}>Confirmadas</Text>
          </View>
        </View>

        <View style={[styles.card, { marginBottom: 24 }]}>
          <Text style={[styles.statNumber, { color: '#6366F1' }]}>{stats.deliveredByMe}</Text>
          <Text style={styles.statLabel}>Entregadas</Text>
        </View>

        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

        <TouchableOpacity
          onPress={() => onNavigate('pharmacy-pending')}
          style={styles.adminMenuItem}
        >
          <Text style={styles.adminMenuIcon}>📋</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminMenuText}>Recetas Pendientes</Text>
            <Text style={styles.adminMenuSubtext}>Ver recetas sin confirmar</Text>
          </View>
          {stats.pendingGlobal > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{stats.pendingGlobal}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigate('pharmacy-confirmed')}
          style={styles.adminMenuItem}
        >
          <Text style={styles.adminMenuIcon}>✅</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminMenuText}>Mis Confirmaciones</Text>
            <Text style={styles.adminMenuSubtext}>Recetas que tengo disponibles</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigate('pharmacy-delivered')}
          style={styles.adminMenuItem}
        >
          <Text style={styles.adminMenuIcon}>📦</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminMenuText}>Historial Entregadas</Text>
            <Text style={styles.adminMenuSubtext}>Recetas ya retiradas</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigate('logout-confirm')}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};