import { useState } from "react";
import axios from "axios";
import styles from './Login.module.css';
import logoImage from '../assets/images/logo-6@3x.png';
import toast from "react-hot-toast";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");
  
  try {
    const res = await axios.post("http://172.18.27.53:5000/login", form);
    console.log("Respuesta completa del servidor:", res.data);
    console.log("Campos recibidos:", {
      token: !!res.data.token,
      username: !!res.data.username, 
      name: !!res.data.name,
      cc: !!res.data.cc,
    });
    
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.username);
    localStorage.setItem("name", res.data.name);
    localStorage.setItem("userCC", res.data.cc);

    toast.success("Inicio de sesión exitoso");
    onLogin(res.data.username, res.data.name, res.data.cc);

    // ⏳ Logout automático después de 1 minuto con toast promise
    setTimeout(() => {
      // Crear una promesa para el cierre de sesión
      const logoutPromise = new Promise((resolve, reject) => {
        try {
          // Simular un pequeño delay para la animación
          setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("name");
            localStorage.removeItem("userCC");
            resolve(); // Resolvemos la promesa exitosamente
          }, 1500); // Pequeño delay para mejor UX
        } catch (error) {
          reject(error);
        }
      });

      // Mostrar el toast promise
      toast.promise(
        logoutPromise,
        {
          loading: 'Cerrando sesión...',
          success: <b>Sesión cerrada por inactividad</b>,
          error: <b>Error al cerrar sesión</b>,
        }
      ).then(() => {
        // Recargar la página después de que se complete el toast
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      });

    }, 3600000); // 1 hora en ms

  } catch (err) {
    toast.error("Credenciales inválidas");
    setError(err.response?.data?.msg || "Error de login");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h2>Bienvenido de nuevo</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>
        
        {/*{error && <div className={styles.errorMessage}>{error}</div>}*/}
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Ingresa tu usuario"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <div className={styles.passwordInputContainer}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
              required
              className={styles.passwordInput}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={styles.passwordToggle}
              disabled={isLoading}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <svg className={styles.passwordIcon} viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M1 1l22 22" strokeWidth="2"></path>
                </svg>
              ) : (
                <svg className={styles.passwordIcon} viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
            </div>
            
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loadingText}>Iniciando sesión...</span>
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>
        
      </div>
      
      <div className={styles.illustration}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.formShape}></div>
        <h3>Electrificadora del Meta</h3>
        <img src={logoImage} alt="EMSA" className={styles.logo} />
        <p>Acta de revisión para clientes destacados</p>
      </div>
    </div>
  );
}