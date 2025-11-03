export interface User {
  id: number;  // SQLite usa INTEGER PRIMARY KEY
  email: string;
  name: string;
  phone?: string;
  role: 'patient' | 'admin';
  password?: string;  // Solo se usa internamente, no se expone
  created_at?: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  distance: string;
  phone?: string;
  schedule?: string;
  accepts: boolean;
  accepts_insurance: number;  // SQLite usa 0/1 para boolean (REQUERIDO para conversión)
  created_at?: string;
}

export interface Prescription {
  id: number;
  user_id: number;
  medicine: string;
  pharmacy_id?: number;
  pharmacy_name?: string;  // Viene del JOIN
  image_uri?: string;
  status: string;  // 'pending', 'completed', 'cancelled'
  date: string;
  created_at?: string;
  user_name?: string;  // Solo para admin
}