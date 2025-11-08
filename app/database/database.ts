// ============================================
// app/database/database.ts - CON SISTEMA DE FARMACIAS
// ============================================
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('medify.db');

export const initDatabase = () => {
  try {
    // Tabla de usuarios (ACTUALIZADA con pharmacy_id)
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'patient',
        pharmacy_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pharmacy_id) REFERENCES pharmacies (id)
      );
    `);

    // Tabla de farmacias
    db.execSync(`
      CREATE TABLE IF NOT EXISTS pharmacies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        distance TEXT,
        phone TEXT,
        schedule TEXT,
        accepts_insurance INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de recetas (ACTUALIZADA con estado pharmacy_confirmed)
    db.execSync(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        medicine TEXT NOT NULL,
        pharmacy_id INTEGER,
        image_uri TEXT,
        status TEXT DEFAULT 'pending',
        date TEXT NOT NULL,
        pharmacy_confirmed INTEGER DEFAULT 0,
        confirmation_message TEXT,
        confirmed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (pharmacy_id) REFERENCES pharmacies (id)
      );
    `);

    // Crear usuario admin
    const adminExists = db.getFirstSync('SELECT * FROM users WHERE email = ?', ['admin@medify.com']);
    if (!adminExists) {
      db.runSync(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        ['admin@medify.com', 'admin123', 'Administrador', 'admin']
      );
      console.log('✅ Usuario admin creado');
    }

    // Crear farmacias de ejemplo
    const pharmaciesCount = db.getFirstSync('SELECT COUNT(*) as count FROM pharmacies') as any;
    if (pharmaciesCount.count === 0) {
      db.runSync(
        `INSERT INTO pharmacies (name, address, distance, phone, schedule) VALUES 
         ('Farmacia Central', 'Av. Corrientes 1234', '0.5 km', '+54 11 1234-5678', 'Lun-Vie: 8:00-20:00'),
         ('Farmacias del Dr.', 'Calle Florida 567', '1.2 km', '+54 11 8765-4321', 'Lun-Sab: 9:00-21:00')`
      );
      console.log('✅ Farmacias creadas');

      // Crear usuario farmacia de ejemplo
      db.runSync(
        'INSERT INTO users (email, password, name, role, pharmacy_id) VALUES (?, ?, ?, ?, ?)',
        ['farmacia@central.com', 'farmacia123', 'Farmacia Central', 'pharmacy', 1]
      );
      console.log('✅ Usuario farmacia creado');
    }

    console.log('✅ Base de datos inicializada');
  } catch (error) {
    console.error('❌ Error al inicializar BD:', error);
    throw error;
  }
};

export default db;