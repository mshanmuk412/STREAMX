import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Login({ onBack, onRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("Logging in...");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");

      console.log("User:", data.user);

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Cannot connect to backend server");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>
          STREAMX
        </h1>

        <h2 style={styles.subtitle}>
          Login
        </h2>

        <div style={styles.apiBox}>
          <strong>Backend:</strong> {API_URL}
        </div>

        <form onSubmit={handleLogin}>

          <label style={styles.label}>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={styles.input}
            required
          />

          <button
            type="submit"
            style={styles.button}
          >
            Login
          </button>

        </form>

        {message && (
          <p style={styles.message}>
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={onRegister}
          style={styles.registerButton}
        >
          Create a new account
        </button>

        <button
          type="button"
          onClick={onBack}
          style={styles.backButton}
        >
          ← Back to Home
        </button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },

  card: {
    width: "350px",
    padding: "30px",
    backgroundColor: "#222",
    borderRadius: "12px",
    boxSizing: "border-box",
  },

  title: {
    textAlign: "center",
    color: "#e50914",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    color: "white",
    marginBottom: "25px",
  },

  label: {
    display: "block",
    color: "white",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "18px",
    boxSizing: "border-box",
    borderRadius: "6px",
    border: "1px solid #555",
    backgroundColor: "#333",
    color: "white",
    fontSize: "15px",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#e50914",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  registerButton: {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    border: "none",
    backgroundColor: "transparent",
    color: "#e50914",
    fontSize: "14px",
    cursor: "pointer",
  },

  backButton: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    border: "1px solid #555",
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
  },

  message: {
    textAlign: "center",
    color: "white",
    marginTop: "20px",
  },

  apiBox: {
    marginBottom: "18px",
    padding: "10px 12px",
    borderRadius: "8px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #444",
    color: "#f5f5f5",
    fontSize: "13px",
    wordBreak: "break-all",
  },
};

export default Login;