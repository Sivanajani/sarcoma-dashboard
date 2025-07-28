import './RawModuleDataTable.css';

interface RawModuleDataTableProps {
  moduleData: Record<string, any>;
}

const RawModuleDataTable = ({ moduleData }: RawModuleDataTableProps) => {
  return (
    <table className="raw-module-table">
      <tbody>
        {Object.entries(moduleData).map(([key, value]) => (
          <tr key={key}>
            <td className="field-name">{key.replace(/_/g, ' ')}</td>
            <td className="field-value">
              {Array.isArray(value)
                ? value.join(', ')
                : value === null || value === ''
                ? '–'
                : String(value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RawModuleDataTable;
