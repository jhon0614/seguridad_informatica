import { useEffect, useState } from "react";
import Login from "./pages/Login";
function App() {
  const [user, setUser] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, [token]);
  async function loadAdminStats() {
    const response = await fetch("http://localhost:3000/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setAdminStats(data);
  }
  if (!token) return <Login />;
  return (
    <div>
      {" "}
      <h1>SecureDesk ADSO</h1>{" "}
      <p>
        Sesion activa: {user?.email} - Rol: {user?.role}
      </p>{" "}
      {user?.role === "ADMIN" ? (
        <button onClick={loadAdminStats}> Consultar estadisticas admin </button>
      ) : (
        <p>Tu rol no tiene acceso a estadisticas administrativas.</p>
      )}{" "}
      {adminStats && <pre>{JSON.stringify(adminStats, null, 2)}</pre>}{" "}
    </div>
  );
}
export default App;
