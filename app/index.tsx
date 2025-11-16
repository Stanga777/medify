// ============================================
// app/index.tsx - COMPLETO CON FIREBASE
// ============================================
import React, { useState, useEffect } from 'react';
import { Alert, View, Text, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebaseConfig';

// Servicios de Firebase
import { 
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  updateUserProfile,
  createPharmacyUser,
  UserData
} from './services/authService';

import {
  getAllPharmacies,
  addPharmacy,
  updatePharmacy
} from './services/pharmacyService';

import {
  addPrescription,
  getUserPrescriptions,
  getPendingPrescriptions,
  getPharmacyPrescriptions,
  confirmPrescriptionWithPrice,
  markPrescriptionDelivered,
  getPharmacyStats
} from './services/prescriptionService';

import { Pharmacy, Prescription } from './tipos/usuario';

// Componentes
import { PantallaInicioSesion } from './componentes/PantallaInicioSesion';
import { PantallaRegistro } from './componentes/PantallaRegistro';
import { PantallaDashboard } from './componentes/PantallaDashboard';
import { PantallaCargarReceta } from './componentes/PantallaCargarReceta';
import { PantallaFarmacias } from './componentes/PantallaFarmacias';
import { PantallaDetalleFarmacia } from './componentes/PantallaDetalleFarmacia';
import { PantallaConfirmacion } from './componentes/PantallaConfirmacion';
import { PantallaHistorial } from './componentes/PantallaHistorial';
import { PantallaPerfil } from './componentes/PantallaPerfil';
import { PantallaEditarPerfil } from './componentes/PantallaEditarPerfil';
import { PantallaRecuperarClave } from './componentes/PantallaRecuperarClave';
import { PantallaCerrarSesion } from './componentes/PantallaCerrarSesion';
import { PantallaAdminDashboard } from './componentes/PantallaAdminDashboard';
import { PantallaAdminFarmacias } from './componentes/PantallaAdminFarmacias';
import { PantallaAdminFormularioFarmacia } from './componentes/PantallaAdminFormularioFarmacia';
import { PantallaFarmaciaDashboard } from './componentes/PantallaFarmaciaDashboard';
import { PantallaFarmaciaRecetasPendientes } from './componentes/PantallaFarmaciaRecetasPendientes';
import { PantallaFarmaciaDetalleReceta } from './componentes/PantallaFarmaciaDetalleReceta';
import { PantallaFarmaciaConfirmadas } from './componentes/PantallaFarmaciaConfirmadas';
import { PantallaDetalleRecetaPaciente } from './componentes/PantallaDetalleRecetaPaciente';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para datos
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  // Escuchar cambios de autenticación (Firebase)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          // Obtener datos del usuario desde Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            setCurrentUser(userData);

            // Navegar según rol
            if (userData.role === 'admin') {
              setCurrentScreen('admin-dashboard');
            } else if (userData.role === 'pharmacy') {
              setCurrentScreen('pharmacy-dashboard');
            } else {
              setCurrentScreen('dashboard');
            }
          }
        } catch (error) {
          console.error('Error al cargar usuario:', error);
        }
      } else {
        setCurrentUser(null);
        setCurrentScreen('onboarding');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Cargar datos cuando cambia el usuario
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser]);

  // Cargar datos del usuario
  const loadUserData = async () => {
    try {
      console.log('🔵 Cargando datos del usuario...');
      console.log('👤 Usuario actual:', currentUser);
      
      // Cargar farmacias
      const pharmaciesData = await getAllPharmacies();
      setPharmacies(pharmaciesData);

      // Cargar recetas según el rol
      if (currentUser?.role === 'patient' && currentUser?.uid) {
        console.log('🔵 Cargando recetas del paciente:', currentUser.uid);
        const prescriptionsData = await getUserPrescriptions(currentUser.uid);
        console.log('📋 Recetas del paciente:', prescriptionsData);
        console.log('📊 Cantidad:', prescriptionsData.length);
        setPrescriptions(prescriptionsData);
      } else if (currentUser?.role === 'pharmacy' && currentUser?.pharmacy_id) {
        console.log('🔵 Cargando recetas de la farmacia:', currentUser.pharmacy_id);
        const prescriptionsData = await getPharmacyPrescriptions(currentUser.pharmacy_id);
        console.log('📋 Recetas de la farmacia:', prescriptionsData);
        setPrescriptions(prescriptionsData);
      }
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
    }
  };

  // Login con Firebase
  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await loginUser(email, password);
      // onAuthStateChanged se encarga del resto
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Registro con Firebase
  const handleRegister = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      await registerUser(email, password, name, phone);
      Alert.alert(
        '¡Registro Exitoso!',
        'Tu cuenta ha sido creada. Ya puedes iniciar sesión.',
        [{ text: 'OK', onPress: () => setCurrentScreen('onboarding') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Recuperar contraseña
  const handleResetPassword = async (email: string) => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert(
        'Email Enviado',
        'Revisa tu correo para restablecer tu contraseña',
        [{ text: 'OK', onPress: () => setCurrentScreen('onboarding') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Actualizar perfil
  const handleUpdateProfile = async (name: string, phone: string) => {
    if (!currentUser?.uid) {
      Alert.alert('Error', 'No hay usuario logueado');
      return;
    }

    try {
      await updateUserProfile(currentUser.uid, name, phone);
      
      // Actualizar estado local
      setCurrentUser({
        ...currentUser,
        name,
        phone
      });

      Alert.alert(
        '¡Perfil Actualizado!',
        'Tus cambios se guardaron correctamente',
        [{ text: 'OK', onPress: () => setCurrentScreen('profile') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Tomar foto
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso Denegado', 'Necesitamos acceso a tu cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri);
    }
  };

  // Subir desde galería
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso Denegado', 'Necesitamos acceso a tu galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri);
    }
  };

  // Guardar receta en Firebase
  const handleSavePrescription = async () => {
    if (!currentUser?.uid || !uploadedImage) {
      Alert.alert('Error', 'No hay imagen para guardar');
      return;
    }

    try {
      setLoading(true);
      const prescriptionId = await addPrescription(
        currentUser.uid,
        'Medicamento recetado',
        uploadedImage
      );

      if (prescriptionId) {
        Alert.alert(
          '¡Receta Guardada!',
          'Tu receta fue enviada a todas las farmacias',
          [{ 
            text: 'OK', 
            onPress: () => {
              setUploadedImage(null);
              setCurrentScreen('dashboard');
              loadUserData();
            }
          }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      setUploadedImage(null);
      setPrescriptions([]);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  // Pantalla de carga
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#6B7280' }}>Cargando...</Text>
      </View>
    );
  }

  // Renderizar pantalla actual
  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <PantallaInicioSesion onNavigate={setCurrentScreen} onLogin={handleLogin} />;

      case 'register':
        return <PantallaRegistro onNavigate={setCurrentScreen} onRegister={handleRegister} />;

      case 'forgot-password':
        return <PantallaRecuperarClave onNavigate={setCurrentScreen} onResetPassword={handleResetPassword} />;

      case 'dashboard':
        return <PantallaDashboard currentUser={currentUser} onNavigate={setCurrentScreen} />;

      case 'upload':
        return (
          <PantallaCargarReceta
            uploadedImage={uploadedImage}
            onNavigate={setCurrentScreen}
            onTakePhoto={takePhoto}
            onPickImage={pickImage}
            onClearImage={() => setUploadedImage(null)}
            onSave={handleSavePrescription}
          />
        );

      case 'pharmacies':
        return <PantallaFarmacias pharmacies={pharmacies} onNavigate={setCurrentScreen} />;

      case 'pharmacy-detail':
        return <PantallaDetalleFarmacia onNavigate={setCurrentScreen} />;

      case 'confirmation':
        return <PantallaConfirmacion onNavigate={setCurrentScreen} />;

      case 'history':
        return (
          <PantallaHistorial 
            prescriptions={prescriptions} 
            onNavigate={setCurrentScreen}
            onSelectPrescription={(prescription) => {
              setSelectedPrescription(prescription);
              setCurrentScreen('patient-prescription-detail');
            }}
          />
        );

      case 'patient-prescription-detail':
        return (
          <PantallaDetalleRecetaPaciente
            prescription={selectedPrescription}
            onNavigate={setCurrentScreen}
            onPaymentComplete={loadUserData}
          />
        );

      case 'profile':
        return <PantallaPerfil currentUser={currentUser} onNavigate={setCurrentScreen} />;

      case 'edit-profile':
        return (
          <PantallaEditarPerfil 
            currentUser={currentUser}
            onNavigate={setCurrentScreen}
            onUpdateProfile={handleUpdateProfile}
          />
        );

      case 'logout-confirm':
        return (
          <PantallaCerrarSesion
            userType={currentUser?.role || 'patient'}
            onNavigate={setCurrentScreen}
            onLogout={handleLogout}
          />
        );

      case 'admin-dashboard':
        return <PantallaAdminDashboard onNavigate={setCurrentScreen} />;

      case 'admin-pharmacies':
        return <PantallaAdminFarmacias pharmacies={pharmacies} onNavigate={setCurrentScreen} />;

      case 'admin-pharmacy-form':
        return <PantallaAdminFormularioFarmacia onNavigate={setCurrentScreen} />;

      case 'pharmacy-dashboard':
        return <PantallaFarmaciaDashboard currentUser={currentUser} onNavigate={setCurrentScreen} />;

      case 'pharmacy-pending':
        return (
          <PantallaFarmaciaRecetasPendientes
            onNavigate={setCurrentScreen}
            onSelectPrescription={(prescription) => {
              setSelectedPrescription(prescription);
              setCurrentScreen('pharmacy-detail-prescription');
            }}
          />
        );

      case 'pharmacy-detail-prescription':
        return (
          <PantallaFarmaciaDetalleReceta
            prescription={selectedPrescription}
            currentUser={currentUser}
            onNavigate={setCurrentScreen}
            onConfirmed={loadUserData}
          />
        );

      case 'pharmacy-confirmed':
        return <PantallaFarmaciaConfirmadas currentUser={currentUser} onNavigate={setCurrentScreen} />;

      default:
        return <PantallaInicioSesion onNavigate={setCurrentScreen} onLogin={handleLogin} />;
    }
  };

  return renderScreen();
}