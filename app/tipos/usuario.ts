// ============================================
// app/tipos/usuario.ts - FIREBASE VERSION
// ============================================

export interface User {
  uid: string;  // ← STRING (Firebase usa UIDs)
  email: string;
  name: string;
  phone?: string;
  role: 'patient' | 'admin' | 'pharmacy';
  pharmacy_id?: string;  // ← STRING
  createdAt?: Date;
}

export interface Pharmacy {
  id: string;  // ← STRING
  name: string;
  address: string;
  distance: string;
  phone?: string;
  schedule?: string;
  accepts: boolean;
  createdAt?: Date;
}

export interface Prescription {
  id: string;  // ← STRING
  user_id: string;  // ← STRING
  medicine: string;
  pharmacy_id?: string;  // ← STRING
  pharmacy_name?: string;
  image_uri?: string;
  status: string;  // 'pending', 'confirmed', 'delivered'
  date: string;
  pharmacy_confirmed: boolean;  // ← BOOLEAN (no number)
  confirmation_message?: string;
  confirmed_at?: Date;
  price: number;
  payment_status: string;  // 'pending', 'paid', 'failed'
  payment_id?: string;
  payment_method?: string;
  createdAt?: Date;
  user_name?: string;
  user_phone?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}