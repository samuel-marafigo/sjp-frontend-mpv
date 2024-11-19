import { useState, useEffect, useRef } from "react";
import Autocomplete from "../components/Autocomplete";
import DataTable from "../components/DataTable";
import { fetchDispensationByHour } from "../services/dispensationService";
import { fetchUnits } from "../services/unitService";
import { fetchItems } from "../services/itemService";
import "../styles/global.css";
import "../styles/buttons.css";
import "../styles/dispensation.css";

type Item = { id: string; name: string };
type TransformedData = {
  batch: string;
  timestamp: string;
  quantity: number;
  operation_type: string;
};

const DispensationPage = () => {
  const [data, setData] = useState<TransformedData[]>([]);
  const [unitQuery, setUnitQuery] = useState("");
  const [itemQuery, setItemQuery] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<Item | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today's date
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const unitDictionaryRef = useRef<{ [key: string]: string }>({});
  const itemDictionaryRef = useRef<{ [key: string]: string }>({});

  // Fetch units and items on initial load
  useEffect(() => {
    const fetchData = async () => {
      const fetchedUnits = await fetchUnits();
      const fetchedItems = await fetchItems();
      setUnits(fetchedUnits);
      setItems(fetchedItems);

      // Create dictionaries for lookup
      unitDictionaryRef.current = fetchedUnits.reduce((acc, unit) => {
        acc[unit.id] = unit.name;
        return acc;
      }, {} as { [key: string]: string });

      itemDictionaryRef.current = fetchedItems.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {} as { [key: string]: string });
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!selectedUnit || !selectedItem || !date) return;

    setLoading(true);
    try {
      const response = await fetchDispensationByHour(selectedUnit.id, selectedItem.id, date);
      const transformedData = response.map((item: any) => ({
        batch: item.batch,
        timestamp: new Date(item.timestamp).toLocaleString(),
        quantity: item.quantity,
        operation_type: item.operation_type,
      }));
      setData(transformedData);
    } catch (error) {
      console.error("Error fetching dispensation data", error);
    }
    setLoading(false);
  };

  const handleToggleUnitList = () => setUnitQuery("");
  const handleToggleItemList = () => setItemQuery("");

  return (
    <div className="container">
      <h1>Dados de Dispensação</h1>
      <div className="filter-container">
        <Autocomplete
          options={units}
          onSelect={setSelectedUnit}
          query={unitQuery}
          setQuery={setUnitQuery}
          placeholder="Digite o nome da unidade"
          onToggleList={handleToggleUnitList}
        />
        <Autocomplete
          options={items}
          onSelect={setSelectedItem}
          query={itemQuery}
          setQuery={setItemQuery}
          placeholder="Digite o nome do medicamento"
          onToggleList={handleToggleItemList}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
        <button onClick={handleSearch} className={`button search-button ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "Carregando..." : "Buscar"}
        </button>
      </div>
      {data.length > 0 && (
        <DataTable
          data={data}
          searchType={2} // Specific for dispensation
        />
      )}
    </div>
  );
};

export default DispensationPage;
