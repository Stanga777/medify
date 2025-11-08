// ============================================
// app/database/prescriptionService.ts - ACTUALIZADO
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

// NUEVO: Obtener recetas pendientes (sin farmacia asignada)
export const getPendingPrescriptions = (): Prescription[] => {
  try {
    const prescriptions = db.getAllSync(
      `SELECT p.*, u.name as user_name, u.phone as user_phone
       FROM prescriptions p
       INNER JOIN users u ON p.user_id = u.id
       WHERE p.pharmacy_id IS NULL AND p.status = 'pending'
       ORDER BY p.created_at DESC`
    ) as Prescription[];
    return prescriptions;
  } catch (error) {
    console.error('Error al obtener recetas pendientes:', error);
    return [];
  }
};

// NUEVO: Obtener recetas de una farmacia específica
export const getPharmacyPrescriptions = (pharmacyId: number): Prescription[] => {
  try {
    const prescriptions = db.getAllSync(
      `SELECT p.*, u.name as user_name, u.phone as user_phone
       FROM prescriptions p
       INNER JOIN users u ON p.user_id = u.id
       WHERE p.pharmacy_id = ?
       ORDER BY p.created_at DESC`,
      [pharmacyId]
    ) as Prescription[];
    return prescriptions;
  } catch (error) {
    console.error('Error al obtener recetas de farmacia:', error);
    return [];
  }
};

// Agregar receta (sin farmacia específica - va a todas)
export const addPrescription = (
  userId: number,
  medicine: string,
  imageUri?: string
): Prescription | null => {
  try {
    const date = new Date().toISOString().split('T')[0];
    
    const result = db.runSync(
      'INSERT INTO prescriptions (user_id, medicine, image_uri, date, status) VALUES (?, ?, ?, ?, ?)',
      [userId, medicine, imageUri || '', date, 'pending']
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

// NUEVO: Farmacia confirma que tiene la receta
export const confirmPrescription = (
  prescriptionId: number,
  pharmacyId: number,
  message?: string
): boolean => {
  try {
    const confirmedAt = new Date().toISOString();
    
    db.runSync(
      `UPDATE prescriptions 
       SET pharmacy_id = ?, 
           pharmacy_confirmed = 1, 
           status = 'confirmed',
           confirmation_message = ?,
           confirmed_at = ?
       WHERE id = ?`,
      [pharmacyId, message || 'Receta disponible para retiro', confirmedAt, prescriptionId]
    );
    return true;
  } catch (error) {
    console.error('Error al confirmar receta:', error);
    return false;
  }
};

// NUEVO: Marcar receta como entregada
export const markPrescriptionDelivered = (prescriptionId: number): boolean => {
  try {
    db.runSync(
      'UPDATE prescriptions SET status = ? WHERE id = ?',
      ['delivered', prescriptionId]
    );
    return true;
  } catch (error) {
    console.error('Error al marcar como entregada:', error);
    return false;
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

// Obtener todas las recetas (admin)
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

// NUEVO: Estadísticas para farmacia
export const getPharmacyStats = (pharmacyId: number) => {
  try {
    const pendingGlobal = db.getFirstSync(
      'SELECT COUNT(*) as count FROM prescriptions WHERE pharmacy_id IS NULL AND status = ?',
      ['pending']
    ) as any;

    const confirmedByMe = db.getFirstSync(
      'SELECT COUNT(*) as count FROM prescriptions WHERE pharmacy_id = ? AND pharmacy_confirmed = 1',
      [pharmacyId]
    ) as any;

    const deliveredByMe = db.getFirstSync(
      'SELECT COUNT(*) as count FROM prescriptions WHERE pharmacy_id = ? AND status = ?',
      [pharmacyId, 'delivered']
    ) as any;

    return {
      pendingGlobal: pendingGlobal.count,
      confirmedByMe: confirmedByMe.count,
      deliveredByMe: deliveredByMe.count
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