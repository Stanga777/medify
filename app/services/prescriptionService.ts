// ============================================
// app/services/prescriptionService.ts - FIREBASE (SIN STORAGE)
// ============================================
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy as firestoreOrderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Prescription } from '../tipos/usuario';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// Comprimir y convertir imagen a base64
const imageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    // Comprimir imagen para no exceder límite de Firestore (1MB)
    const manipResult = await manipulateAsync(
      imageUri,
      [{ resize: { width: 1024 } }], // Redimensionar a máximo 1024px de ancho
      { compress: 0.7, format: SaveFormat.JPEG }
    );

    const response = await fetch(manipResult.uri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error al convertir imagen:', error);
    throw error;
  }
};

// Agregar receta (con base64)
export const addPrescription = async (
  userId: string,
  medicine: string,
  imageUri?: string
): Promise<string | null> => {
  try {
    let imageData = '';
    if (imageUri) {
      imageData = await imageToBase64(imageUri);
    }

    const docRef = await addDoc(collection(db, 'prescriptions'), {
      user_id: userId,
      medicine,
      image_uri: imageData, // Base64 en vez de URL
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      pharmacy_confirmed: false,
      price: 0,
      payment_status: 'pending',
      createdAt: Timestamp.now()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error al agregar receta:', error);
    return null;
  }
};

// Obtener recetas del usuario
export const getUserPrescriptions = async (userId: string): Promise<Prescription[]> => {
  try {
    const q = query(
      collection(db, 'prescriptions'),
      where('user_id', '==', userId),
      firestoreOrderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Prescription));
  } catch (error) {
    console.error('Error al obtener recetas:', error);
    return [];
  }
};

// Obtener recetas pendientes (sin farmacia asignada)
export const getPendingPrescriptions = async (): Promise<Prescription[]> => {
  try {
    const q = query(
      collection(db, 'prescriptions'),
      where('pharmacy_id', '==', null),
      where('status', '==', 'pending'),
      firestoreOrderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    // Obtener info de usuarios para cada receta
    const prescriptions = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const prescriptionData = docSnap.data();
        const userDoc = await getDoc(doc(db, 'users', prescriptionData.user_id));
        const userData = userDoc.data();
        
        return {
          id: docSnap.id,
          ...prescriptionData,
          user_name: userData?.name,
          user_phone: userData?.phone
        } as Prescription;
      })
    );
    
    return prescriptions;
  } catch (error) {
    console.error('Error al obtener recetas pendientes:', error);
    return [];
  }
};

// Confirmar receta con precio
export const confirmPrescriptionWithPrice = async (
  prescriptionId: string,
  pharmacyId: string,
  price: number,
  message?: string
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'prescriptions', prescriptionId), {
      pharmacy_id: pharmacyId,
      pharmacy_confirmed: true,
      status: 'confirmed',
      confirmation_message: message || 'Receta disponible para retiro',
      confirmed_at: Timestamp.now(),
      price: price
    });
    return true;
  } catch (error) {
    console.error('Error al confirmar receta:', error);
    return false;
  }
};

// Obtener recetas confirmadas por una farmacia
export const getPharmacyPrescriptions = async (pharmacyId: string): Promise<Prescription[]> => {
  try {
    const q = query(
      collection(db, 'prescriptions'),
      where('pharmacy_id', '==', pharmacyId),
      firestoreOrderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const prescriptions = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const prescriptionData = docSnap.data();
        const userDoc = await getDoc(doc(db, 'users', prescriptionData.user_id));
        const userData = userDoc.data();
        
        return {
          id: docSnap.id,
          ...prescriptionData,
          user_name: userData?.name,
          user_phone: userData?.phone
        } as Prescription;
      })
    );
    
    return prescriptions;
  } catch (error) {
    console.error('Error al obtener recetas de farmacia:', error);
    return [];
  }
};

// Marcar como entregada
export const markPrescriptionDelivered = async (prescriptionId: string): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'prescriptions', prescriptionId), {
      status: 'delivered',
      delivered_at: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error al marcar como entregada:', error);
    return false;
  }
};

// Actualizar estado de pago
export const updatePaymentStatus = async (
  prescriptionId: string,
  paymentStatus: string,
  paymentId?: string,
  paymentMethod?: string
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'prescriptions', prescriptionId), {
      payment_status: paymentStatus,
      payment_id: paymentId || '',
      payment_method: paymentMethod || '',
      paid_at: paymentStatus === 'paid' ? Timestamp.now() : null
    });
    return true;
  } catch (error) {
    console.error('Error al actualizar pago:', error);
    return false;
  }
};

// Estadísticas de farmacia
export const getPharmacyStats = async (pharmacyId: string) => {
  try {
    // Recetas pendientes globales
    const pendingQuery = query(
      collection(db, 'prescriptions'),
      where('pharmacy_id', '==', null),
      where('status', '==', 'pending')
    );
    const pendingSnapshot = await getDocs(pendingQuery);
    
    // Confirmadas por esta farmacia
    const confirmedQuery = query(
      collection(db, 'prescriptions'),
      where('pharmacy_id', '==', pharmacyId),
      where('status', '==', 'confirmed')
    );
    const confirmedSnapshot = await getDocs(confirmedQuery);
    
    // Entregadas por esta farmacia
    const deliveredQuery = query(
      collection(db, 'prescriptions'),
      where('pharmacy_id', '==', pharmacyId),
      where('status', '==', 'delivered')
    );
    const deliveredSnapshot = await getDocs(deliveredQuery);
    
    return {
      pendingGlobal: pendingSnapshot.size,
      confirmedByMe: confirmedSnapshot.size,
      deliveredByMe: deliveredSnapshot.size
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      pendingGlobal: 0,
      confirmedByMe: 0,
      deliveredByMe: 0
    };
  }
};