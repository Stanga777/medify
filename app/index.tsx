import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
import { PantallaRecuperarClave } from './componentes/PantallaRecuperarClave';
import { PantallaCerrarSesion } from './componentes/PantallaCerrarSesion';
import { PantallaAdminDashboard } from './componentes/PantallaAdminDashboard';
import { PantallaAdminFarmacias } from './componentes/PantallaAdminFarmacias';
import { PantallaAdminFormularioFarmacia } from './componentes/PantallaAdminFormularioFarmacia';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [userType, setUserType] = useState('patient');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Base de datos simulada
  const [users, setUsers] = useState<User[]>([
    { email: 'admin@medify.com', password: 'admin123', name: 'Administrador' }
  ]);

  // Datos de ejemplo
  const pharmacies: Pharmacy[] = [
    { id: 1, name: 'Farmacia Central', address: 'Av. Corrientes 1234', distance: '0.5 km', accepts: true },
    { id: 2, name: 'Farmacias del Dr.', address: 'Calle Florida 567', distance: '1.2 km', accepts: true },
  ];

  const prescriptions: Prescription[] = [
    { id: 1, medicine: 'Ibuprofeno 600mg', date: '2025-10-20', status: 'Completado' },
    { id: 2, medicine: 'Amoxicilina 500mg', date: '2025-10-15', status: 'Completado' },
  ];

  // Función de Login
  const handleLogin = (email: string, password: string) => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Verificar si es admin
    if (email === 'admin@medify.com' && password === 'admin123') {
      setCurrentUser({ email, password, name: 'Administrador' });
      setUserType('admin');
      setCurrentScreen('admin-dashboard');
      return;
    }

    // Buscar usuario en la base de datos
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      setCurrentUser(user);
      setUserType('patient');
      setCurrentScreen('dashboard');
      Alert.alert('¡Bienvenido!', `Hola ${user.name}`);
    } else {
      Alert.alert('Error', 'Email o contraseña incorrectos');
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

    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Verificar si el email ya existe
    if (users.find(u => u.email === email)) {
      Alert.alert('Error', 'Este email ya está registrado');
      return;
    }

    // Crear nuevo usuario
    const newUser: User = {
      email,
      password,
      name,
      phone,
    };

    setUsers([...users, newUser]);

    Alert.alert(
      '¡Registro Exitoso!',
      'Tu cuenta ha sido creada. Ya puedes iniciar sesión.',
      [{ text: 'OK', onPress: () => setCurrentScreen('onboarding') }]
    );
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
    setUserType('patient');
    setUploadedImage(null);
    setCurrentScreen('onboarding');
  };

  // Renderizar pantalla actual
  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <PantallaInicioSesion onNavigate={setCurrentScreen} onLogin={handleLogin} />;
      
      case 'register':
        return <PantallaRegistro onNavigate={setCurrentScreen} onRegister={handleRegister} />;
      
      case 'forgot-password':
        return <PantallaRecuperarClave onNavigate={setCurrentScreen} />;
      
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
      
      case 'logout-confirm':
        return (
          <PantallaCerrarSesion
            userType={userType}
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