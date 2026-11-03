import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

async function startBackend() {
  try {

    process.env.DB_PATH = app.getPath("userData");

    console.log("📁 Ruta base de datos:", process.env.DB_PATH);

    const backend = await import("../backend/servidor.js");

    backend.startServer();

    console.log("✅ Backend iniciado");

  } catch (err) {

    console.error("❌ Error iniciando backend:", err);

  }
}

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const indexPath = path.join(__dirname, "../dist/index.html");

  console.log("📄 Cargando:", indexPath);

  mainWindow.loadFile(indexPath);

  // debugging
  // mainWindow.webContents.openDevTools();

}

app.whenReady().then(async () => {

  console.log("🚀 Iniciando aplicación...");

  await startBackend();

  createWindow();

});

app.on("window-all-closed", () => {

  if (process.platform !== "darwin") {
    app.quit();
  }

});