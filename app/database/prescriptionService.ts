// ============================================
// app/database/prescriptionService.ts
// ============================================
import db from './database';
import { Prescription } from '../tipos/usuario';

// Obtener recetas de un usuario
export const getUserPrescriptions = (userId: number): Prescription[] => {
  try {
    const prescriptions = db.getAllSync(
      `SELECT p.*, ph.name as pharmacy_name 
       FROM prescriptions p
       LEFT JOIN pharmacies ph ON p.pharmacy_id = ph.id
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC`,
      [userId]
    ) as Prescription[];

    return prescriptions;
  } catch (error) {
    console.error('Error al obtener recetas:', error);
    return [];
  }
};

// Agregar nueva receta
export const addPrescription = (
  userId: number,
  medicine: string,
  imageUri?: string,
  pharmacyId?: number
): Prescription | null => {
  try {
    const date = new Date().toISOString().split('T')[0];
    
    const result = db.runSync(
      'INSERT INTO prescriptions (user_id, medicine, image_uri, pharmacy_id, date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, medicine, imageUri || '', pharmacyId || null, date, 'pending']
    );

    const newPrescription = db.getFirstSync(
      'SELECT * FROM prescriptions WHERE id = ?',
      [result.lastInsertRowId]
    ) as Prescription;

    return newPrescription;
  } catch (error) {
    console.error('Error al agregar receta:', error);
    return null;
  }
};

// Actualizar estado de receta
export const updatePrescriptionStatus = (
  prescriptionId: number,
  status: string
): boolean => {
  try {
    db.runSync(
      'UPDATE prescriptions SET status = ? WHERE id = ?',
      [status, prescriptionId]
    );
    return true;
  } catch (error) {
    console.error('Error al actualizar receta:', error);
    return false;
  }
};

// Actualizar receta completa
export const updatePrescription = (
  prescriptionId: number,
  medicine: string,
  pharmacyId?: number,
  status?: string
): boolean => {
  try {
    if (status) {
      db.runSync(
        'UPDATE prescriptions SET medicine = ?, pharmacy_id = ?, status = ? WHERE id = ?',
        [medicine, pharmacyId || null, status, prescriptionId]
      );
    } else {
      db.runSync(
        'UPDATE prescriptions SET medicine = ?, pharmacy_id = ? WHERE id = ?',
        [medicine, pharmacyId || null, prescriptionId]
      );
    }
    return true;
  } catch (error) {
    console.error('Error al actualizar receta:', error);
    return false;
  }
};

// Eliminar receta
export const deletePrescription = (prescriptionId: number): boolean => {
  try {
    db.runSync('DELETE FROM prescriptions WHERE id = ?', [prescriptionId]);
    return true;
  } catch (error) {
    console.error('Error al eliminar receta:', error);
    return false;
  }
};

// Obtener todas las recetas (solo admin)
export const getAllPrescriptions = (): Prescription[] => {
  try {
    const prescriptions = db.getAllSync(
      `SELECT p.*, u.name as user_name, ph.name as pharmacy_name
       FROM prescriptions p
       INNER JOIN users u ON p.user_id = u.id
       LEFT JOIN pharmacies ph ON p.pharmacy_id = ph.id
       ORDER BY p.created_at DESC`
    ) as Prescription[];

    return prescriptions;
  } catch (error) {
    console.error('Error al obtener todas las recetas:', error);
    return [];
  }
};

// Obtener recetas por farmacia
export const getPrescriptionsByPharmacy = (pharmacyId: number): Prescription[] => {
  try {
    const prescriptions = db.getAllSync(
      `SELECT p.*, u.name as user_name
       FROM prescriptions p
       INNER JOIN users u ON p.user_id = u.id
       WHERE p.pharmacy_id = ?
       ORDER BY p.created_at DESC`,
      [pharmacyId]
    ) as Prescription[];

    return prescriptions;
  } catch (error) {
    console.error('Error al obtener recetas por farmacia:', error);
    return [];
  }
};

// Obtener estadísticas de recetas (para dashboard admin)
export const getPrescriptionStats = () => {
  try {
    const totalPrescriptions = db.getFirstSync(
      'SELECT COUNT(*) as count FROM prescriptions'
    ) as any;

    const pendingPrescriptions = db.getFirstSync(
      'SELECT COUNT(*) as count FROM prescriptions WHERE status = ?',
      ['pending']
    ) as any;

    const completedPrescriptions = db.getFirstSync(
      'SELECT COUNT(*) as count FROM prescriptions WHERE status = ?',
      ['completed']
    ) as any;

    const todayPrescriptions = db.getFirstSync(
      'SELECT COUNT(*) as count FROM prescriptions WHERE date = ?',
      [new Date().toISOString().split('T')[0]]
    ) as any;

    return {
      total: totalPrescriptions.count,
      pending: pendingPrescriptions.count,
      completed: completedPrescriptions.count,
      today: todayPrescriptions.count
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      total: 0,
      pending: 0,
      completed: 0,
      today: 0
    };
  }
};