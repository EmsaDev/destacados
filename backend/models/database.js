// models/database.js
const sqlite3 = require('sqlite3');
const path = require('path');

const dbFolder = process.env.DB_PATH || __dirname;
const dbPath = path.join(dbFolder, 'database.sqlite');

console.log("📁 Ruta DB:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error abriendo DB:", err);
  } else {
    console.log("✅ Base de datos conectada");
  }
});
// ============================================
// INICIALIZACIÓN DE LA BASE DE DATOS
// ============================================

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabla de usuarios
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        name TEXT,
        cc TEXT
      )`, (err) => {
        if (err) {
          console.error('Error creando tabla users:', err);
          reject(err);
        }
      });

      // Tabla de clientes
      db.run(`CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE,
        nombre TEXT,
        direccion TEXT,
        ciudad TEXT
      )`, (err) => {
        if (err) {
          console.error('Error creando tabla clients:', err);
          reject(err);
        }
      });

      // Tabla de reviews
      db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        no INTEGER
      )`, (err) => {
        if (err) {
          console.error('Error creando tabla reviews:', err);
          reject(err);
        }
      });

      // Tabla de marcas
      db.run(`CREATE TABLE IF NOT EXISTS marcaMedidores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL
      )`, (err) => {
        if (err) console.error('Error creando tabla marcaMedidores:', err);
      });

      // Tabla de tipos
      db.run(`CREATE TABLE IF NOT EXISTS tipoMedidores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marca_id INTEGER NOT NULL,
        nombre TEXT NOT NULL
      )`, (err) => {
        if (err) console.error('Error creando tabla tipoMedidores:', err);
      });

      console.log('✅ Tablas inicializadas correctamente');
      resolve();
    });
  });
};

// ============================================
// FUNCIONES PARA USUARIOS
// ============================================

const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT username, name, cc FROM users WHERE id = ?",
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
};

// ============================================
// FUNCIONES PARA CLIENTES
// ============================================

const getClientByCode = (codigo) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM clients WHERE codigo = ?",
      [codigo],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
};

// ============================================
// FUNCIONES PARA REVIEWS
// ============================================

const getNextReviewNumber = () => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT no FROM reviews ORDER BY no DESC LIMIT 1",
      [],
      (err, row) => {
        if (err) reject(err);
        else resolve(row?.no ? row.no + 1 : 1000);
      }
    );
  });
};

const saveReview = async (reviewData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nextNo = await getNextReviewNumber();
      const now = new Date().toISOString();
      
      // Aquí puedes agregar más campos según necesites
      const query = `
        INSERT INTO reviews (
          no, fecha, ciudad, resultado, codigo_suscriptor, codigo_asic,
          solicitud_numero, revision_numero, nombre_cliente, direccion_cliente,
          representante_emsa, cc_representante_emsa, otro_representante, 
          cc_otro_representante, usuario_visitado, cc_usuario_visitado,
          tipo_usuario, derecho, dependencia, contratista, 
          codigos_irregularidades, irregularidad_corregida, medidor_retirado,
          tipo_evidencia, tipo_informe, tipo_informe_otro, 
          estado, creado_en, actualizado_en, creado_por, activo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        nextNo,
        reviewData.fecha || now.split('T')[0],
        reviewData.ciudad,
        reviewData.resultado,
        reviewData.codigo || reviewData.codigo_suscriptor,
        reviewData.asic || reviewData.codigo_asic,
        reviewData.solicitudNo || reviewData.solicitud_numero,
        reviewData.revisionNo || reviewData.revision_numero,
        reviewData.nombre,
        reviewData.direccion,
        reviewData.representante_emsa || reviewData.userData?.name,
        reviewData.cc_representante_emsa || reviewData.userData?.cc,
        reviewData.otroRepresentante,
        reviewData.ccOtroRepresentante,
        reviewData.usuarioVisita,
        reviewData.documentoVisitante,
        reviewData.tipoUsuario,
        reviewData.derecho,
        reviewData.dependencia,
        reviewData.contratista,
        reviewData.codigosIrregularidades,
        reviewData.irregularidadCorrida,
        reviewData.medidorRetirado,
        reviewData.tipoEvidencia,
        reviewData.tipoInforme,
        reviewData.tipoInformeOtro,
        reviewData.estado || 'pendiente',
        now, // creado_en
        now, // actualizado_en
        reviewData.userId || 1,
        1 // activo = true
      ];
      db.run(query, params, function(err) {
        if (err) {
          console.error('Error en saveReview:', err);
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            no: nextNo,
            ...reviewData
          });
        }
      });
      
    } catch (error) {
      reject(error);
    }
  });
};

const getAllReviews = () => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM reviews ORDER BY no DESC",
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const getReviewById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM reviews WHERE id = ?",
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
};

const updateReview = (id, updates) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    
    values.push(id);
    const query = `UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`;
    
    db.run(query, values, function(err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
};

const deleteReview = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM reviews WHERE id = ?',
      [id],
      function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
};

// ============================================
// FUNCIONES PARA MARCAS Y TIPOS
// ============================================

const getAllMarcas = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM marcaMedidores", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getTiposByMarca = (marcaId) => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM tipoMedidores WHERE marca_id = ?",
      [marcaId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

// Exportar todas las funciones
module.exports = {
  initializeDatabase,
  getUserByUsername,
  getUserById,
  getClientByCode,
  getNextReviewNumber,
  saveReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getAllMarcas,
  getTiposByMarca
};