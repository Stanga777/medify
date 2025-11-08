// ============================================
// app/services/pharmacyService.ts - FIREBASE
// ============================================
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Pharmacy } from '../tipos/usuario';

// Obtener todas las farmacias
export const getAllPharmacies = async (): Promise<Pharmacy[]> => {
  try {
    const q = query(collection(db, 'pharmacies'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Pharmacy));
  } catch (error) {
    console.error('Error al obtener farmacias:', error);
    return [];
  }
};

// Obtener farmacia por ID
export const getPharmacyById = async (pharmacyId: string): Promise<Pharmacy | null> => {
  try {
    const docRef = doc(db, 'pharmacies', pharmacyId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Pharmacy;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener farmacia:', error);
    return null;
  }
};

// Agregar nueva farmacia (solo admin)
export const addPharmacy = async (pharmacy: Omit<Pharmacy, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'pharmacies'), {
      ...pharmacy,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al agregar farmacia:', error);
    return null;
  }
};

// Actualizar farmacia (solo admin)
export const updatePharmacy = async (
  pharmacyId: string,
  data: Partial<Pharmacy>
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'pharmacies', pharmacyId), data);
    return true;
  } catch (error) {
    console.error('Error al actualizar farmacia:', error);
    return false;
  }
};

// Eliminar farmacia (solo admin)
export const deletePharmacy = async (pharmacyId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'pharmacies', pharmacyId));
    return true;
  } catch (error) {
    console.error('Error al eliminar farmacia:', error);
    return false;
  }
};