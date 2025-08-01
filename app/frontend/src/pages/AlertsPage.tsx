// src/pages/AlertsPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthProvider';

type Alert = {
  id: number;
  user_id: string;
  patient_external_code: string;
  module: string;
  metric: string;
  threshold: number;
  condition: string;
  email: string;
  frequency: string;
  active: boolean;
  last_triggered: string;
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        if (!auth.token){
            console.warn("Keine Token vorhanden.");
            return;
        }
        
        const res = await axios.get("http://localhost:8000/alerts/me", {
          headers: { Authorization: `Bearer ${auth.token}` }
        });

        setAlerts(res.data as Alert[]);
      } catch (error) {
        console.error("Fehler beim Laden der Alerts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [auth.token]);

  if (loading) return <div>Lade Alerts...</div>;

  return (
    <div>
      <h2>Meine Alerts</h2>
      {alerts.length === 0 ? (
        <p>Du hast noch keine Alerts eingerichtet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Modul</th>
              <th>Metrik</th>
              <th>Bedingung</th>
              <th>Schwellenwert</th>
              <th>Frequenz</th>
              <th>Aktiv</th>
              <th>Zuletzt ausgelöst</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id}>
                <td>{a.patient_external_code}</td>
                <td>{a.module}</td>
                <td>{a.metric}</td>
                <td>{a.condition}</td>
                <td>{a.threshold}</td>
                <td>{a.frequency}</td>
                <td>{a.active ? "✔️" : "❌"}</td>
                <td>{new Date(a.last_triggered).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Hier kannst du später ein Alert-Erstellungsformular einbauen */}
    </div>
  );
};

export default AlertsPage;
