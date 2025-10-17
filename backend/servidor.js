import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Clients from "./models/Clients.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "M3d1d4.emsa";

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/destacados", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
};  

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando 🚀");
});

// 🔑 Login (sin registro)
app.post("/login", async (req, res) => {
    
  const { username, password } = req.body;
  console.log("Body recibido:", req.body);

  try {
    //console.log(username);
    const user = await User.findOne({ username });
    //console.log(user);
    if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });
    

    // Validar password con bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

    // Generar token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, username: user.username, name: user.name, cc: user.cc });
  } catch (err) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

// 🔍 Ruta para consultar clientes por código 
app.post("/api/consultar-cliente", async (req, res) => {
  try {
    console.log("Body recibido:", req.body);
    
    const { codigo, asic } = req.body;
    
    // Validar que el body no esté vacío
    if (!req.body || (typeof req.body !== 'object')) {
      return res.status(400).json({ 
        success: false,
        error: 'Datos de solicitud inválidos' 
      });
    }
    
    // Determinar qué valor buscar
    const valorBusqueda = codigo || asic;
    
    if (!valorBusqueda) {
      return res.status(400).json({ 
        success: false,
        error: 'Se requiere código suscriptor o código ASIC' 
      });
    }
    
    // Buscar usando el modelo Client
    const cliente = await Clients.findOne({ 
      codigo: valorBusqueda 
    });
    
    if (cliente) {
      res.json({ 
        success: true,
        direccion: cliente.direccion,
        ciudad: cliente.ciudad || '', 
        nombre: cliente.nombre || '',
        cliente: {
          codigo: cliente.codigo,
          nombre: cliente.nombre || '',
          ciudad: cliente.ciudad || ''
        }
      });
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'Cliente no encontrado' 
      });
    }
  } catch (error) {
    console.error('Error al consultar cliente:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
});

// 🔍 Ruta para obtener datos del usuario actual
app.get("/api/user-data", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    res.json({
      success: true,
      user: {
        username: user.username,
        name: user.name,
        cc: user.cc
        // Agrega otros campos que necesites
      }
    });
  } catch (error) {
    console.error('Error obteniendo datos del usuario:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
});

// 🔍 Ruta para obtener el próximo número de acta
app.get("/api/next-review-number", authenticateToken, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const reviewsCollection = db.collection('reviews');
    
    // Buscar el último documento por el campo "No."
    const lastReview = await reviewsCollection
      .find({})
      .sort({ "No": -1 }) // ← Usar "No." con punto y entre comillas
      .limit(1)
      .toArray();
    let nextNumber = 1000; // Valor por defecto si no hay actas
    
    if (lastReview.length > 0 && lastReview[0]["No"]) { // ← Acceder con ["No."]
      nextNumber = lastReview[0]["No"] + 1; // ← Incrementar el último número
    }
    
    res.json({ 
      success: true,
      next_review_number: nextNumber
    });
  } catch (error) {
    console.error('Error al obtener número de acta:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://172.18.24.57:${PORT}`);
  console.log(`Accesible desde la red en: http://172.18.24.57:${PORT}`);
});