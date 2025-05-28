import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="dashboard-main">
          <h1>Datenqualitäts-Dashboard</h1>
        </main>
      </div>
    </div>
  );
}

export default App;