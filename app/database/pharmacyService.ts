import db from './database';
import { Pharmacy } from '../tipos/usuario';

// Obtener todas las farmacias
export const getAllPharmacies = (): Pharmacy[] => {
  try {
    const pharmacies = db.getAllSync(
      'SELECT * FROM pharmacies ORDER BY name'
    ) as any[];

    return pharmacies.map(p => ({
      id: p.id,
      name: p.name,
      address: p.address,
      distance: p.distance,
      phone: p.phone,
      schedule: p.schedule,
      accepts: p.accepts_insurance === 1,
      accepts_insurance: p.accepts_insurance,
      created_at: p.created_at
    }));
  } catch (error) {
    console.error('Error al obtener farmacias:', error);
    return [];
  }
};

// Obtener farmacia por ID
export const getPharmacyById = (pharmacyId: number): Pharmacy | null => {
  try {
    const pharmacy = db.getFirstSync(
      'SELECT * FROM pharmacies WHERE id = ?',
      [pharmacyId]
    ) as Pharmacy | null;

    if (pharmacy) {
      return {
        ...pharmacy,
        accepts: pharmacy.accepts_insurance === 1
      };
    }

    return null;
  } catch (error) {
    console.error('Error al obtener farmacia:', error);
    return null;
  }
};

// Agregar nueva farmacia (solo admin)
export const addPharmacy = (
  name: string,
  address: string,
  distance: string,
  phone?: string,
  schedule?: string
): Pharmacy | null => {
  try {
    const result = db.runSync(
      'INSERT INTO pharmacies (name, address, distance, phone, schedule) VALUES (?, ?, ?, ?, ?)',
      [name, address, distance, phone || '', schedule || '']
    );

    const newPharmacy = db.getFirstSync(
      'SELECT * FROM pharmacies WHERE id = ?',
      [result.lastInsertRowId]
    ) as Pharmacy;

    return {
      ...newPharmacy,
      accepts: newPharmacy.accepts_insurance === 1
    };
  } catch (error) {
    console.error('Error al agregar farmacia:', error);
    return null;
  }
};

// Actualizar farmacia (solo admin)
export const updatePharmacy = (
  pharmacyId: number,
  name: string,
  address: string,
  distance: string,
  phone?: string,
  schedule?: string
): boolean => {
  try {
    db.runSync(
      'UPDATE pharmacies SET name = ?, address = ?, distance = ?, phone = ?, schedule = ? WHERE id = ?',
      [name, address, distance, phone || '', schedule || '', pharmacyId]
    );
    return true;
  } catch (error) {
    console.error('Error al actualizar farmacia:', error);
    return false;
  }
};

// Eliminar farmacia (solo admin)
export const deletePharmacy = (pharmacyId: number): boolean => {
  try {
    db.runSync('DELETE FROM pharmacies WHERE id = ?', [pharmacyId]);
    return true;
  } catch (error) {
    console.error('Error al eliminar farmacia:', error);
    return false;
  }
};

// Buscar farmacias cercanas (por distancia)
export const searchNearbyPharmacies = (maxDistance: number): Pharmacy[] => {
  try {
    // Nota: Esto es una búsqueda simple. Para una app real usarías geolocalización
    const pharmacies = db.getAllSync(
      'SELECT * FROM pharmacies ORDER BY distance'
    ) as Pharmacy[];

    return pharmacies.map(p => ({
      ...p,
      accepts: p.accepts_insurance === 1
    }));
  } catch (error) {
    console.error('Error al buscar farmacias:', error);
    return [];
  }
};