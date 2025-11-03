// ============================================
// app/database/userService.ts
// ============================================
import db from './database';
import { User } from '../tipos/usuario';

// Registrar nuevo usuario
export const registerUser = (
  email: string,
  password: string,
  name: string,
  phone?: string
): User | null => {
  try {
    // Verificar si el email ya existe
    const existingUser = db.getFirstSync(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      throw new Error('Este email ya está registrado');
    }

    // Validaciones
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    // Insertar usuario
    const result = db.runSync(
      'INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)',
      [email, password, name, phone || '']
    );

    // Obtener el usuario creado
    const newUser = db.getFirstSync(
      'SELECT id, email, name, phone, role FROM users WHERE id = ?',
      [result.lastInsertRowId]
    ) as User;

    return newUser;
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

// Login de usuario
export const loginUser = (email: string, password: string): User | null => {
  try {
    const user = db.getFirstSync(
      'SELECT id, email, name, phone, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    ) as User | null;

    if (!user) {
      throw new Error('Email o contraseña incorrectos');
    }

    return user;
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// Obtener usuario por ID
export const getUserById = (userId: number): User | null => {
  try {
    const user = db.getFirstSync(
      'SELECT id, email, name, phone, role FROM users WHERE id = ?',
      [userId]
    ) as User | null;

    return user;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
};

// Actualizar perfil de usuario
export const updateUser = (
  userId: number,
  name: string,
  phone?: string
): boolean => {
  try {
    db.runSync(
      'UPDATE users SET name = ?, phone = ? WHERE id = ?',
      [name, phone || '', userId]
    );
    return true;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return false;
  }
};

// Cambiar contraseña
export const changePassword = (
  userId: number,
  oldPassword: string,
  newPassword: string
): boolean => {
  try {
    // Verificar contraseña actual
    const user = db.getFirstSync(
      'SELECT * FROM users WHERE id = ? AND password = ?',
      [userId, oldPassword]
    );

    if (!user) {
      throw new Error('Contraseña actual incorrecta');
    }

    if (newPassword.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
    }

    // Actualizar contraseña
    db.runSync(
      'UPDATE users SET password = ? WHERE id = ?',
      [newPassword, userId]
    );

    return true;
  } catch (error: any) {
    console.error('Error al cambiar contraseña:', error);
    throw error;
  }
};

// Recuperar contraseña (simulado - en SQLite no podemos enviar emails)
export const resetPassword = (email: string): boolean => {
  try {
    const user = db.getFirstSync(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // En una app real, aquí enviarías un email
    // Por ahora, solo reseteamos a una contraseña temporal
    const tempPassword = 'temporal123';
    db.runSync(
      'UPDATE users SET password = ? WHERE email = ?',
      [tempPassword, email]
    );

    console.log(`Contraseña temporal para ${email}: ${tempPassword}`);
    return true;
  } catch (error: any) {
    console.error('Error al resetear contraseña:', error);
    throw error;
  }
};

// Obtener todos los usuarios (solo admin)
export const getAllUsers = (): User[] => {
  try {
    const users = db.getAllSync(
      'SELECT id, email, name, phone, role, created_at FROM users ORDER BY created_at DESC'
    ) as User[];

    return users;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};