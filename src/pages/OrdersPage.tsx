// src/pages/OrdersPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUnits } from '../services/unitService';
import { Unit } from '../types/Unit';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FloatingFeedbackButton from '../components/FloatingFeedbackButton';
import FloatingHelpButton from '../components/FloatingHelpButton';
import PageTracker from '../components/PageTracker';
//import '../styles/global.css';

const OrdersPage = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnitsData = async () => {
      const unitsData = await fetchUnits();
      setUnits(unitsData);
    };

    fetchUnitsData();
  }, []);

  const handleUnitSelect = (_: any, value: Unit | null) => {
    if (value) {
      navigate(`/pedidos/${value.id}`);
    }
  };

  return (
    <div className="container">
      <PageTracker />
      <h1>Pedidos</h1>
      <Autocomplete
        options={units}
        getOptionLabel={(option) => option.name}
        onChange={handleUnitSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Procurar por unidade"
            fullWidth
            helperText="Digite ou selecione uma unidade"
          />
        )}
        sx={{ width: '30%' }}
      />
                        <FloatingFeedbackButton />
                        <FloatingHelpButton description="" />
    </div>
  );
};

export default OrdersPage;
