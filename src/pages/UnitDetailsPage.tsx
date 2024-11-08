// src/pages/UnitDetailsPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUnitRestockDetails } from '../services/restockService';
import { fetchItems } from '../services/itemService';
import { Item } from '../types/Item';
import '../styles/global.css';

type RestockDetail = {
  item_id: string;
  restock_request_quantity: number;
  timestamp: string;
};

const UnitDetailsPage = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const [restockDetails, setRestockDetails] = useState<RestockDetail[]>([]);
  const [itemsDictionary, setItemsDictionary] = useState<{ [key: string]: string }>({});
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await fetchUnitRestockDetails(unitId!);
      setRestockDetails(details);
      if (details.length > 0) {
        setLastUpdated(new Date(details[0].timestamp).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
      }
    };

    const fetchItemsDictionary = async () => {
      const items = await fetchItems();
      const dictionary = items.reduce((acc: { [key: string]: string }, item: Item) => {
        acc[item.id] = item.name;
        return acc;
      }, {});
      setItemsDictionary(dictionary);
    };

    fetchDetails();
    fetchItemsDictionary();
  }, [unitId]);

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="back-button">← Voltar</button>
      <h1>Detalhes do Pedido para Unidade {unitId}</h1>
      {lastUpdated && <p>Última atualização: {lastUpdated}</p>}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantidade a Pedir</th>
            </tr>
          </thead>
          <tbody>
            {restockDetails.map((detail) => (
              <tr key={detail.item_id}>
                <td>{itemsDictionary[detail.item_id] || detail.item_id}</td>
                <td>{detail.restock_request_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnitDetailsPage;
