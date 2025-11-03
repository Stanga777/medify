// ============================================
// app/database/database.ts
// ============================================
import * as SQLite from 'expo-sqlite';

// Abrir/crear base de datos
const db = SQLite.openDatabaseSync('medify.db');

// Inicializar tablas
export const initDatabase = () => {
  try {
    // Tabla de usuarios
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'patient',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

    // Tabla de recetas
    db.execSync(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        medicine TEXT NOT NULL,
        pharmacy_id INTEGER,
        image_uri TEXT,
        status TEXT DEFAULT 'pending',
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (pharmacy_id) REFERENCES pharmacies (id)
      );
    `);

    // Crear usuario admin por defecto
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
      console.log('✅ Farmacias de ejemplo creadas');
    }

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    throw error;
  }
};

export default db;