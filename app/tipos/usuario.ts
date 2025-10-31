export interface User {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  distance: string;
  accepts: boolean;
}

export interface Prescription {
  id: number;
  medicine: string;
  date: string;
  status: string;
}