// filepath: /Users/jesusalmanza/Library/Mobile Documents/com~apple~CloudDocs/Escuela/Cuarto semestre/01 Desarrollo integral para aplicaciones empresariales/ServerXWeb/Proyecto/FrontClient/src/pages/Articulos.tsx
import { useState, useEffect } from 'react';
import { ArticuloFilter } from '../components/Articulo/Filter/ArticuloFilter';
import { ArticuloCard } from '../components/Articulo/Card/ArticuloCard';
import { ArticuloSkeleton } from '../components/Articulo/Skeleton/ArticuloSkeleton';
import { useArticulos } from '../hooks/useArticulos';
import { useCategorias } from '../hooks/useCategorias';
import type { Articulo } from '../services/articulosService';
import { useCarrito } from '../hooks/useCarrito';
import '../styles/Articulos.css'; // Importar los nuevos estilos

interface ArticulosProps {
  searchTerm?: string; // Añadir prop searchTerm
}

export function Articulos({ searchTerm }: ArticulosProps) { // Añadir prop searchTerm
  const { articulos: rawArticulos, loading: isLoadingArticulos, error: errorArticulos, reload: refetchArticulos } = useArticulos();
  const { categorias, loading: isLoadingCategorias, error: errorCategorias, reload: refetchCategorias } = useCategorias();
  const { agregarAlCarrito } = useCarrito(); // Obtener la función para agregar al carrito

  const [articulosMostrados, setArticulosMostrados] = useState<Articulo[]>([]);
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());

  // Cargar favoritos desde localStorage al montar el componente
  useEffect(() => {
    const favoritosGuardados = localStorage.getItem('favoritos');
    if (favoritosGuardados) {
      try {
        const favoritosArray = JSON.parse(favoritosGuardados);
        setFavoritos(new Set(favoritosArray));
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (rawArticulos) {
      let articulosFiltrados = rawArticulos;
      if (searchTerm && searchTerm.trim() !== '') {
        const lowerSearchTerm = searchTerm.toLowerCase();
        articulosFiltrados = rawArticulos.filter(articulo => 
          articulo.nombre.toLowerCase().includes(lowerSearchTerm) ||
          (articulo.categoria && articulo.categoria.toLowerCase().includes(lowerSearchTerm)) ||
          articulo.descripcion?.toLowerCase().includes(lowerSearchTerm)
        );
      }
      setArticulosMostrados(articulosFiltrados);
    }
  }, [rawArticulos, searchTerm]); // Añadir searchTerm a las dependencias

  const handleArticulosProcesados = (articulosProcesados: Articulo[]) => {
    // Si hay un término de búsqueda, la lógica de filtrado principal ya se hizo en el useEffect.
    // Esta función ahora principalmente manejará el ordenamiento desde ArticuloFilter.
    // O, si ArticuloFilter también filtra por categoría (además de la búsqueda global), necesitamos combinar.
    // Por ahora, asumimos que ArticuloFilter puede refinar más la búsqueda o solo ordenar.
    
    let articulosParaMostrar = articulosProcesados;

    if (searchTerm && searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      // Re-filtramos los articulosProcesados (que ya vienen filtrados/ordenados por ArticuloFilter)
      // para asegurar que también cumplen con el searchTerm global.
      articulosParaMostrar = articulosProcesados.filter(articulo => 
        articulo.nombre.toLowerCase().includes(lowerSearchTerm) ||
        (articulo.categoria && articulo.categoria.toLowerCase().includes(lowerSearchTerm)) ||
        articulo.descripcion?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    setArticulosMostrados(articulosParaMostrar);
  };

  const handleAddToCart = (articulo: Articulo) => {
    console.log('Agregando al carrito:', articulo);
    agregarAlCarrito(articulo); // Usar la función del hook useCarrito
  };

  const handleToggleFavorite = (articulo: Articulo) => {
    const nuevosFavoritos = new Set(favoritos);
    
    if (favoritos.has(articulo._id)) {
      nuevosFavoritos.delete(articulo._id);
    } else {
      nuevosFavoritos.add(articulo._id);
    }
    
    setFavoritos(nuevosFavoritos);
    
    // Guardar en localStorage
    localStorage.setItem('favoritos', JSON.stringify(Array.from(nuevosFavoritos)));
  };

  if (isLoadingArticulos || isLoadingCategorias) {
    return (
      <div className="articulos-page-container">
        <div className="articulo-filter-container">
          <div className="shimmer" style={{ height: '2rem', width: '200px', borderRadius: '8px' }} />
          <div className="shimmer" style={{ height: '2rem', width: '250px', borderRadius: '8px' }} />
        </div>
        <div className="articulos-grid">
          <ArticuloSkeleton count={8} />
        </div>
      </div>
    );
  }

  if (errorArticulos) {
    return (
      <div className="articulos-error-container">
        <p>Error al cargar artículos: {errorArticulos}</p>
        <button onClick={refetchArticulos} className="articulos-retry-button">Reintentar</button>
      </div>
    );
  }

  if (errorCategorias) {
    return (
      <div className="articulos-error-container">
        <p>Error al cargar categorías: {errorCategorias}</p>
        <button onClick={refetchCategorias} className="articulos-retry-button">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="articulos-page-container">
      
      
      <ArticuloFilter
        categorias={categorias || []}
        rawArticulos={rawArticulos || []}
        onArticulosProcesados={handleArticulosProcesados}
      />

      {articulosMostrados.length === 0 && !isLoadingArticulos && (
        <div className="articulos-empty-container">
          <div className="articulos-empty-icon">🛍️</div>
          <p>No se encontraron artículos con los filtros seleccionados.</p>
          <p className="articulos-empty-subtitle">Prueba a cambiar los filtros o buscar algo diferente.</p>
        </div>
      )}

      <div className="articulos-grid">
        {articulosMostrados.map(articulo => (
          <div key={articulo._id} className="articulo-col"> {/* Usar articulo-col para centrar la tarjeta si es necesario */}
            <ArticuloCard
              articulo={articulo}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favoritos.has(articulo._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Articulos;
