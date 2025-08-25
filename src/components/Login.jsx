import { useState } from "react";
import axios from "axios";
import styles from './Login.module.css';
import logoImage from '../assets/images/logo-6@3x.png';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await axios.post("http://172.18.27.53:5000/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("usercc", res.data.cc);
      onLogin(res.data.username, res.data.name, res.data.cc);
    } catch (err) {
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
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
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
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
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