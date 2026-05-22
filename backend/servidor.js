// servidor.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import nodemailer from "nodemailer";
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

// Configuración de multer para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Límite de 10MB
  }
});

// Configuración del transporter de correo
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "apoyo.cgm@emsa-esp.com.co",
    pass: "myktyywbcbnvlhpn",
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

// Verificar conexión con el servidor de correo
transporter.verify(function(error, success) {
  if (error) {
    console.log("⚠️ Error en conexión SMTP:", error);
  } else {
    console.log("✅ Servidor de correo listo para enviar mensajes");
  }
});

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
      correo: cliente.correo || "",
      cliente: {
        codigo: cliente.codigo,
        nombre: cliente.nombre || "",
        ciudad: cliente.ciudad || "",
        correo: cliente.correo || "",
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

// 📧 Endpoint para enviar correo con PDF y TXT adjuntos
// Cambia upload.single("pdf") por upload.fields()
app.post("/enviar", upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'txt', maxCount: 1 }
]), async (req, res) => {
  try {
    const { to, actaNumber, nombreCliente } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Destinatario requerido" });
    }

    if (!req.files || !req.files['pdf']) {
      return res.status(400).json({ error: "Archivo PDF requerido" });
    }

    // Obtener los archivos
    const pdfFile = req.files['pdf'][0];
    const txtFile = req.files['txt'] ? req.files['txt'][0] : null;

    // Número de acta (si no viene, usar un valor por defecto)
    const numeroActa = actaNumber || '1001';
    const cliente = nombreCliente || 'No especificado';
    
    // Fecha actual formateada
    const fechaActual = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Configurar attachments - SIEMPRE incluir el PDF
    const attachments = [
      {
        filename: `Acta_Revision_No_${numeroActa}.pdf`,
        content: pdfFile.buffer,
        contentType: 'application/pdf'
      }
    ];

    // Si hay archivo TXT, agregarlo como adjunto
    if (txtFile) {
      attachments.push({
        filename: txtFile.originalname,
        content: txtFile.buffer,
        contentType: 'text/plain'
      });
      console.log("✅ Archivo TXT agregado al correo:", txtFile.originalname);
    } else {
      console.log("ℹ️ No se adjuntó archivo TXT");
    }

    // Intentar agregar logo si existe
    const fs = await import('fs');
    const path = await import('path');
    const logoPath = path.join(process.cwd(), 'logo.png');
    
    if (fs.existsSync(logoPath)) {
      attachments.push({
        filename: "logo.png",
        path: logoPath,
        cid: "logo"
      });
      console.log("✅ Logo agregado al correo");
    } else {
      console.log("⚠️ Logo no encontrado en:", logoPath);
    }

    // Preparar la lista de archivos adjuntos para mostrar en el HTML
    const archivosAdjuntos = [`📄 Acta_Revision_No_${numeroActa}.pdf`];
    if (txtFile) {
      archivosAdjuntos.push(`📊 ${txtFile.originalname}`);
    }

    // Enviar correo
    const info = await transporter.sendMail({
      from: '"Gerencia de Control de Energia" <apoyo.cgm@emsa-esp.com.co>',
      to: to,
      subject: `Acta de Revisión N° ${numeroActa} - ${cliente}`,
      html: `
        <div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
            <tr>
              <td align="center">
                <!-- Card principal -->
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.08);">
                  
                  <!-- Header con logo -->
                  <tr>
                    <td style="background:#007bff;padding:20px;text-align:center;color:#fff;">
                      <img src="cid:logo" alt="EMSA Logo" style="height:60px;margin-bottom:10px;" />
                      <h2 style="margin:0;">Acta de Revisión N° ${numeroActa}</h2>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:30px;color:#333;">
                      <h3 style="margin-top:0;">¡Hola! 👋</h3>
                      
                      <p style="line-height:1.6;color:#555;">
                        Este correo ha sido generado automáticamente desde el Sistema de Gestión de Medidas.
                      </p>

                      <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin:20px 0;">
                        <p style="margin:0;"><strong>📋 Detalle del Acta:</strong></p>
                        <p style="margin:5px 0 0 0;color:#555;">
                          <strong>N° Acta:</strong> ${numeroActa}<br>
                          <strong>Cliente:</strong> ${cliente}<br>
                          <strong>Fecha:</strong> ${fechaActual}
                        </p>
                      </div>

                      <div style="background:#e7f1ff;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #0d6efd;">
                        <p style="margin:0;color:#0d6efd;">
                          <strong>📎 Archivos adjuntos:</strong><br>
                          ${archivosAdjuntos.map(archivo => `&nbsp;&nbsp;📌 ${archivo}<br>`).join('')}
                        </p>
                        ${txtFile ? '<p style="margin:10px 0 0 0;font-size:12px;color:#6c757d;">💡 El archivo .txt contiene los datos estructurados del acta en formato JSON.</p>' : ''}
                      </div>

                      <p style="line-height:1.6;color:#555;">
                        Se adjunta el acta de revisión en formato PDF con toda la información correspondiente a la visita técnica realizada.
                        ${txtFile ? ' Adicionalmente, se incluye un archivo de datos (.txt) con la información estructurada para su procesamiento.' : ''}
                      </p>
                     </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777;">
                      <p style="margin:0;">⚠️ Este es un correo automático, por favor no responder a esta dirección.</p>
                      <p style="margin:5px 0 0 0;">⚡ EMSA ESP - Control de Energía 2026 todos los derechos reservados</p>
                      <p style="margin:5px 0 0 0;">powered by ing. Nicolas Rodriguez</p>
                     </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
      attachments: attachments
    });

    console.log("Correo enviado:", info.messageId);
    console.log(`   - Destinatario: ${to}`);
    console.log(`   - Acta N°: ${numeroActa}`);
    console.log(`   - PDF: Acta_Revision_No_${numeroActa}.pdf`);
    if (txtFile) {
      console.log(`   - TXT: ${txtFile.originalname}`);
    }
    
    res.json({ 
      success: true, 
      message: 'Correo enviado exitosamente',
      messageId: info.messageId,
      actaNumber: numeroActa,
      attachments: attachments.map(a => a.filename)
    });

  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    res.status(500).json({ 
      success: false, 
      error: "Error al enviar el correo",
      details: error.message 
    });
  }
});

// 🚀 Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📧 Endpoint de correo disponible en http://localhost:${PORT}/api/enviar-correo`);
});