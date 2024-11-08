import { useState } from 'react';
import '../styles/datatable.css';

interface DataTableProps {
  data: any[];
  searchType: number;
  unitName?: string;
  itemName?: string;
}

const DataTable: React.FC<DataTableProps> = ({ data, searchType, unitName, itemName }) => {
  const [sortState, setSortState] = useState<{ [key: string]: number }>({});

  const handleSort = (key: string) => {
    setSortState((prev) => {
      const newState = { ...prev, [key]: (prev[key] || 0) + 1 };
      if (newState[key] > 2) newState[key] = 0;
      return newState;
    });
  };

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const sortedData = [...data].sort((a, b) => {
    for (const [key, order] of Object.entries(sortState)) {
      if (order === 1) {
        if (key === 'expiry_date') {
          return parseDate(a[key]) > parseDate(b[key]) ? 1 : -1;
        } else if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
      } else if (order === 2) {
        if (key === 'expiry_date') {
          return parseDate(a[key]) < parseDate(b[key]) ? 1 : -1;
        } else if (a[key] > b[key]) return -1;
        if (a[key] < b[key]) return 1;
      }
    }
    return 0;
  });

  const columns = searchType === 0
    ? ['Unidade', 'Lote', 'Data de Validade', 'Quantidade']  // Show unit name for 'Procurar por medicamento'
    : ['Nome', 'Lote', 'Data de Validade', 'Quantidade'];    // Show item name for 'Procurar por unidade'

  return (
    <div>
      {searchType === 0 && itemName && <h2>{itemName}</h2>}
      {searchType === 1 && unitName && <h2>{unitName}</h2>}
      
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} onClick={() => handleSort(column)}>
                  {column} {sortState[column] === 1 ? '↑' : sortState[column] === 2 ? '↓' : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr key={idx}>
                {searchType === 0 && (
                  <td data-label="Unidade">{row.unit}</td>   
                )}
                {searchType === 1 && (
                  <td data-label="Nome">{row.name}</td>   
                )}
                <td data-label="Lote">{row.batch}</td>
                <td data-label="Data de Validade">{row.expiry_date}</td>
                <td data-label="Quantidade">{row.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
