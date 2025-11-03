// ============================================
// app/index.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { Alert, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Importar servicios de SQLite
import { initDatabase } from './database/database';
import { 
  registerUser as dbRegisterUser, 
  loginUser as dbLoginUser,
  resetPassword as dbResetPassword,
  updateUser as dbUpdateUser
} from './database/userService';
import { getAllPharmacies } from './database/pharmacyService';
import { getUserPrescriptions } from './database/prescriptionService';

import { User, Pharmacy, Prescription } from './tipos/usuario';

// Importar componentes
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para datos
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  // Inicializar base de datos al montar la app
  useEffect(() => {
    const init = async () => {
      try {
        initDatabase();
        console.log('✅ Base de datos lista');
      } catch (error) {
        console.error('❌ Error al inicializar BD:', error);
        Alert.alert('Error', 'No se pudo inicializar la base de datos');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Cargar datos cuando cambia el usuario
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser]);

  // Cargar datos del usuario
  const loadUserData = () => {
    try {
      // Cargar farmacias
      const pharmaciesData = getAllPharmacies();
      setPharmacies(pharmaciesData);

      // Cargar recetas del usuario
      if (currentUser?.id) {
        const prescriptionsData = getUserPrescriptions(currentUser.id);
        setPrescriptions(prescriptionsData);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  // Función de Login
  const handleLogin = (email: string, password: string) => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const user = dbLoginUser(email, password);
      
      if (user) {
        setCurrentUser(user);

        // Navegar según el rol
        if (user.role === 'admin') {
          setCurrentScreen('admin-dashboard');
        } else {
          setCurrentScreen('dashboard');
        }

        Alert.alert('¡Bienvenido!', `Hola ${user.name}`);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Email o contraseña incorrectos');
    }
  };

  // Función de Registro
  const handleRegister = (
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) => {
    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const newUser = dbRegisterUser(email, password, name, phone);

      if (newUser) {
        Alert.alert(
          '¡Registro Exitoso!',
          'Tu cuenta ha sido creada. Ya puedes iniciar sesión.',
          [{ text: 'OK', onPress: () => setCurrentScreen('onboarding') }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
    }
  };

  // Recuperar contraseña
  const handleResetPassword = (email: string) => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    try {
      dbResetPassword(email);
      Alert.alert(
        'Contraseña Temporal',
        'Tu nueva contraseña temporal es: temporal123\n\nCámbiala después de iniciar sesión.',
        [{ text: 'OK', onPress: () => setCurrentScreen('onboarding') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Usuario no encontrado');
    }
  };

  // NUEVA FUNCIÓN: Actualizar perfil
  const handleUpdateProfile = (name: string, phone: string) => {
    if (!currentUser?.id) {
      Alert.alert('Error', 'No hay usuario logueado');
      return;
    }

    try {
      const success = dbUpdateUser(currentUser.id, name, phone);

      if (success) {
        // Actualizar el estado del usuario actual
        setCurrentUser({
          ...currentUser,
          name: name,
          phone: phone
        });

        Alert.alert(
          '¡Perfil Actualizado!',
          'Tus cambios se guardaron correctamente',
          [{ text: 'OK', onPress: () => setCurrentScreen('profile') }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    }
  };

  // Función para tomar foto
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso Denegado', 'Necesitamos acceso a tu cámara para tomar fotos');
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

  // Función para subir desde galería
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso Denegado', 'Necesitamos acceso a tu galería para seleccionar fotos');
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

  // Función de Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setUploadedImage(null);
    setPrescriptions([]);
    setCurrentScreen('onboarding');
  };

  // Pantalla de carga
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <Text style={{ fontSize: 18, color: '#4A90E2' }}>Inicializando...</Text>
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
        return (
          <PantallaRecuperarClave
            onNavigate={setCurrentScreen}
            onResetPassword={handleResetPassword}
          />
        );

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
          />
        );

      case 'pharmacies':
        return <PantallaFarmacias pharmacies={pharmacies} onNavigate={setCurrentScreen} />;

      case 'pharmacy-detail':
        return <PantallaDetalleFarmacia onNavigate={setCurrentScreen} />;

      case 'confirmation':
        return <PantallaConfirmacion onNavigate={setCurrentScreen} />;

      case 'history':
        return <PantallaHistorial prescriptions={prescriptions} onNavigate={setCurrentScreen} />;

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

      default:
        return <PantallaInicioSesion onNavigate={setCurrentScreen} onLogin={handleLogin} />;
    }
  };

  return renderScreen();
}