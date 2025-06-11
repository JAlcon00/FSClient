import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'; // Importar useState
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Articulos from './pages/Articulos';
import CarritoPage from './pages/CarritoPage';
import Navbar from './layout/Navbar';

function App() {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  return (
    <BrowserRouter>
      <>
        <div className="container mt-4">
          <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> {/* Pasar props a Navbar */}
          {/* El código de la barra de navegación fue movido a Navbar.tsx */}

          <Routes>
            <Route path="/" element={<Articulos searchTerm={searchTerm} />} /> {/* Pasar searchTerm a Articulos */}
            <Route path="/articulos" element={<Articulos searchTerm={searchTerm} />} /> {/* Pasar searchTerm a Articulos */}
            <Route path="/carrito" element={<CarritoPage />} />
            {/* Otras rutas pueden ir aquí */}
          </Routes>
        </div>
      </>
    </BrowserRouter>
  )
}

export default App
