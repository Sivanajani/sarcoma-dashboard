import CromDatabase from './CromDatabase';
import PromDatabase from './PromDatabase';

const DatabasePage = () => {
  return (
    <div className="dashboard-main">
      <h1>Datenbankzugriff</h1>
      <CromDatabase />
      <hr style={{ margin: '2rem 0' }} />
      <PromDatabase />
    </div>
  );
};

export default DatabasePage;