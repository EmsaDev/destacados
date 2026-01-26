import bcrypt from "bcryptjs";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Configuración __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión a SQLite
const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ Error SQLite:", err.message);
  else console.log("✅ Conectado a SQLite");
});

async function crearUsuario() {
  const hashed = await bcrypt.hash("123456789", 10);
  
  db.run(
    `INSERT INTO users (username, password, role, name, cc) VALUES (?, ?, ?, ?, ?)`,
    ["test", hashed, "user", "User Test", "111111"],
    function (err) {
      if (err) {
        console.error("❌ Error creando usuario:", err.message);
      } else {
        console.log("Usuario creado ✅", "ID:", this.lastID);
      }
      db.close();
    }
  );
}

crearUsuario();
