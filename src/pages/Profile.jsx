function Profile({ user, onBack, onLogout }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.logo}>STREAMX</h1>

        <h2 style={styles.title}>My Profile</h2>

        <div style={styles.avatar}>
          👤
        </div>

        <div style={styles.info}>
          <p>
            <strong>Name:</strong> {user?.name}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <p>
            <strong>Role:</strong> {user?.role}
          </p>
        </div>

        <button
          style={styles.logoutButton}
          onClick={onLogout}
        >
          Logout
        </button>

        <button
          style={styles.backButton}
          onClick={onBack}
        >
          ← Back
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
    width: "400px",
    padding: "35px",
    backgroundColor: "#222",
    borderRadius: "12px",
    textAlign: "center",
    boxSizing: "border-box",
  },

  logo: {
    color: "#e50914",
    marginBottom: "10px",
  },

  title: {
    color: "white",
    marginBottom: "25px",
  },

  avatar: {
    fontSize: "60px",
    marginBottom: "25px",
  },

  info: {
    color: "#ddd",
    textAlign: "left",
    lineHeight: "1.8",
    marginBottom: "25px",
  },

  logoutButton: {
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

  backButton: {
    width: "100%",
    padding: "10px",
    marginTop: "12px",
    border: "1px solid #555",
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default Profile;