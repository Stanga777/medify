// ============================================
// app/services/authService.ts - FIREBASE
// ============================================
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

export interface UserData {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  role: 'patient' | 'admin' | 'pharmacy';
  pharmacy_id?: string;
  createdAt: Date;
}

// Registrar nuevo usuario
export const registerUser = async (
  email: string,
  password: string,
  name: string,
  phone?: string
): Promise<UserData> => {
  try {
    // Crear usuario en Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Crear documento en Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      name,
      phone: phone || '',
      role: 'patient',
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    return userData;
  } catch (error: any) {
    throw new Error(getErrorMessage(error.code));
  }
};

// Iniciar sesión
export const loginUser = async (
  email: string,
  password: string
): Promise<UserData> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener datos del usuario desde Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }

    return userDoc.data() as UserData;
  } catch (error: any) {
    throw new Error(getErrorMessage(error.code));
  }
};

// Cerrar sesión
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error('Error al cerrar sesión');
  }
};

// Recuperar contraseña
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(getErrorMessage(error.code));
  }
};

// Obtener usuario actual
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Actualizar perfil
export const updateUserProfile = async (
  uid: string,
  name: string,
  phone?: string
): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', uid), { name, phone }, { merge: true });
  } catch (error) {
    throw new Error('Error al actualizar perfil');
  }
};

// Crear usuario de farmacia (solo admin)
export const createPharmacyUser = async (
  email: string,
  password: string,
  name: string,
  pharmacyId: string,
  phone?: string
): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      name,
      phone: phone || '',
      role: 'pharmacy',
      pharmacy_id: pharmacyId,
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userData);
  } catch (error: any) {
    throw new Error(getErrorMessage(error.code));
  }
};

// Mensajes de error en español
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'Este email ya está registrado',
    'auth/invalid-email': 'Email inválido',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión',
  };
  return errorMessages[errorCode] || 'Error desconocido';
};