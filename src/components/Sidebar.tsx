import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768); // Open by default on larger screens
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false); // Collapse on small screens
      } else {
        setIsOpen(true); // Extend on large screens
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial state
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const goToHomePage = () => navigate('/');
  const goToOrdersPage = () => navigate('/pedidos');
  const goToOptionsPage = () => navigate('/opcoes');

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? '←' : '→'}
      </button>
      {isOpen && (
        <div className="sidebar-content">
          <button onClick={goToHomePage} className="sidebar-button">Procurar Medicamentos</button>
          <button onClick={goToOrdersPage} className="sidebar-button">Pedidos</button>
          <button onClick={goToOptionsPage} className="sidebar-button">Opções</button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;