// servidor.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  initializeDatabase,
  saveReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getUserByUsername,
  getUserById,
  getClientByCode,
  getAllMarcas,
  getTiposByMarca,
  getNextReviewNumber
} from "./models/database.js";

// Configuración básica
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "M3d1d4.emsa";

app.use(cors());
app.use(express.json());

// Inicializar base de datos al inicio
initializeDatabase().then(() => {
  console.log("✅ Base de datos inicializada");
}).catch(err => {
  console.error("❌ Error inicializando base de datos:", err);
});

// Middleware JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Ruta base
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando 🚀 (SQLite)");
});

// 🔑 Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await getUserByUsername(username);
    
    if (!user) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      username: user.username,
      name: user.name,
      cc: user.cc,
      role: user.role
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ msg: "Error en servidor" });
  }
});

// Consultar cliente
app.post("/api/consultar-cliente", async (req, res) => {
  try {
    const { codigo, asic } = req.body;
    const valorBusqueda = codigo || asic;

    if (!valorBusqueda) {
      return res.status(400).json({ success: false, error: "Código requerido" });
    }

    const cliente = await getClientByCode(valorBusqueda);

    if (!cliente) {
      return res.status(404).json({ success: false, error: "Cliente no encontrado" });
    }

    res.json({
      success: true,
      direccion: cliente.direccion,
      ciudad: cliente.ciudad || "",
      nombre: cliente.nombre || "",
      cliente: {
        codigo: cliente.codigo,
        nombre: cliente.nombre || "",
        ciudad: cliente.ciudad || ""
      }
    });
  } catch (error) {
    console.error("Error consultando cliente:", error);
    res.status(500).json({ success: false, error: "Error servidor" });
  }
});

// 🔍 Datos usuario actual
app.get("/api/user-data", authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error obteniendo datos usuario:", error);
    res.status(500).json({ error: "Error servidor" });
  }
});

//  Próximo número de acta
app.get("/api/next-review-number", authenticateToken, async (req, res) => {
  try {
    const nextNumber = await getNextReviewNumber();

    res.json({
      success: true,
      next_review_number: nextNumber
    });
  } catch (error) {
    console.error("Error obteniendo próximo número:", error);
    res.status(500).json({ error: "Error servidor" });
  }
});

// 📋 Marcas de medidores
app.get("/marcas", async (req, res) => {
  try {
    const rows = await getAllMarcas();
    res.json(rows);
  } catch (error) {
    console.error("Error consultando marcas:", error);
    res.status(500).json({ error: "Error al consultar marcas" });
  }
});

// 📋 Tipos por marca
app.get("/tipos/:id", async (req, res) => {
  try {
    const rows = await getTiposByMarca(req.params.id);
    res.json(rows);
  } catch (error) {
    console.error("Error consultando tipos:", error);
    res.status(500).json({ error: "Error al consultar tipos" });
  }
});

// 💾 Endpoint para guardar reviews
app.post('/reviews', async (req, res) => {
  try {
    const reviewData = req.body;
    const result = await saveReview(reviewData);
    res.status(201).json({ 
      success: true, 
      message: 'Acta guardada exitosamente',
      data: result 
    });
  } catch (error) {
    console.error('Error en endpoint /reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error guardando el acta',
      error: error.message 
    });
  }
});

// 📋 Obtener todas las reviews (opcional, si la necesitas)
app.get('/reviews', authenticateToken, async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.json({ 
      success: true, 
      data: reviews 
    });
  } catch (error) {
    console.error('Error obteniendo reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo actas' 
    });
  }
});

// 🚀 Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});