import { useState, useMemo, useEffect } from 'react';
import type { Categoria } from '../../../services/categoriasService';
import type { Articulo } from '../../../services/articulosService';
import { 
  FunnelIcon, 
  AdjustmentsHorizontalIcon, 
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import '../../../styles/Articulos.css';

interface ArticuloFilterProps {
  categorias: Categoria[];
  rawArticulos: Articulo[];
  onArticulosProcesados: (articulos: Articulo[]) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export function ArticuloFilter({
  categorias,
  rawArticulos,
  onArticulosProcesados,
  viewMode = 'grid',
  onViewModeChange,
}: ArticuloFilterProps) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [orden, setOrden] = useState<'precio-asc' | 'precio-desc' | 'az' | 'za'>('precio-asc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Auto-expandir filtros solo si el usuario ya los había expandido antes
  useEffect(() => {
    const savedExpandedState = localStorage.getItem('articulos-filter-expanded');
    
    const handleResize = () => {
      // Solo auto-expandir en desktop si estaba previamente expandido
      if (window.innerWidth > 768 && savedExpandedState === 'true') {
        setFiltersExpanded(true);
      } else {
        // Por defecto siempre contraído
        setFiltersExpanded(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar historial de búsquedas del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('articulos-search-history');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (error) {
        console.warn('Error loading search history:', error);
      }
    }
  }, []);

  // Guardar búsqueda en historial
  const saveSearchToHistory = (search: string) => {
    if (!search.trim() || search.length < 2) return;
    
    const updatedHistory = [search, ...searchHistory.filter(s => s !== search)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem('articulos-search-history', JSON.stringify(updatedHistory));
  };

  // Generar sugerencias de búsqueda
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) return [];
    
    const suggestions = new Set<string>();
    const searchLower = searchTerm.toLowerCase();
    
    rawArticulos.forEach(articulo => {
      if (articulo.nombre.toLowerCase().includes(searchLower)) {
        suggestions.add(articulo.nombre);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [rawArticulos, searchTerm]);

  const articulosProcesados = useMemo(() => {
    setIsProcessing(true);
    let articulosResultado = [...rawArticulos];

    // Filtrar por búsqueda de texto
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      articulosResultado = articulosResultado.filter(
        (articulo) =>
          articulo.nombre.toLowerCase().includes(searchLower) ||
          articulo.descripcion?.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por categoría
    if (categoriaSeleccionada) {
      articulosResultado = articulosResultado.filter(
        (articulo) => articulo.categoria === categoriaSeleccionada
      );
    }

    // Ordenar
    switch (orden) {
      case 'precio-asc':
        articulosResultado.sort((a, b) => Number(a.precio) - Number(b.precio));
        break;
      case 'precio-desc':
        articulosResultado.sort((a, b) => Number(b.precio) - Number(a.precio));
        break;
      case 'az':
        articulosResultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'za':
        articulosResultado.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }
    
    // Simular procesamiento breve para mostrar feedback visual
    setTimeout(() => setIsProcessing(false), 200);
    
    return articulosResultado;
  }, [rawArticulos, categoriaSeleccionada, orden, searchTerm]);

  useEffect(() => {
    onArticulosProcesados(articulosProcesados);
  }, [articulosProcesados, onArticulosProcesados]);

  const handleClearFilters = () => {
    setCategoriaSeleccionada('');
    setSearchTerm('');
    setOrden('precio-asc');
  };

  const handleToggleFilters = () => {
    const newExpanded = !filtersExpanded;
    setFiltersExpanded(newExpanded);
    // Guardar el estado en localStorage
    localStorage.setItem('articulos-filter-expanded', newExpanded.toString());
  };

  const hasActiveFilters = categoriaSeleccionada || searchTerm.trim();
  
  // Obtener nombre de categoría para mostrar en filtros activos
  const getCategoryName = (categoryId: string) => {
    const category = categorias.find(cat => cat._id === categoryId);
    return category ? category.nombre : categoryId;
  };

  // Lista de filtros activos para mostrar
  const activeFilters = useMemo(() => {
    const filters: Array<{ type: string; label: string; value: string }> = [];
    
    if (searchTerm.trim()) {
      filters.push({
        type: 'search',
        label: 'Búsqueda',
        value: searchTerm.trim()
      });
    }
    
    if (categoriaSeleccionada) {
      filters.push({
        type: 'category',
        label: 'Categoría',
        value: getCategoryName(categoriaSeleccionada)
      });
    }
    
    if (orden !== 'precio-asc') {
      const orderLabels = {
        'precio-desc': 'Precio: Mayor a Menor',
        'az': 'Nombre: A-Z',
        'za': 'Nombre: Z-A'
      };
      filters.push({
        type: 'sort',
        label: 'Orden',
        value: orderLabels[orden as keyof typeof orderLabels]
      });
    }
    
    return filters;
  }, [searchTerm, categoriaSeleccionada, orden, categorias]);

  return (
    <div className={`articulo-filter-modern ${isProcessing ? 'articulo-filter-modern--processing' : ''}`}>
      {/* Header del filtro */}
      <div className="articulo-filter-modern__header">
        <div className="articulo-filter-modern__title-section">
          <FunnelIcon className="articulo-filter-modern__main-icon" />
          <h3 className="articulo-filter-modern__title">Filtros y búsqueda</h3>
          <span className="articulo-filter-modern__count">
            {articulosProcesados.length} artículo{articulosProcesados.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="articulo-filter-modern__actions">
          {/* Botones de vista */}
          {onViewModeChange && (
            <div className="articulo-filter-modern__view-toggle">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`articulo-filter-modern__view-btn ${viewMode === 'grid' ? 'articulo-filter-modern__view-btn--active' : ''}`}
                aria-label="Vista en cuadrícula"
              >
                <Squares2X2Icon className="articulo-filter-modern__view-icon" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`articulo-filter-modern__view-btn ${viewMode === 'list' ? 'articulo-filter-modern__view-btn--active' : ''}`}
                aria-label="Vista en lista"
              >
                <ListBulletIcon className="articulo-filter-modern__view-icon" />
              </button>
            </div>
          )}

          {/* Botón para expandir/colapsar filtros */}
          <button
            onClick={handleToggleFilters}
            className="articulo-filter-modern__toggle-btn"
            aria-label="Mostrar/ocultar filtros"
          >
            <AdjustmentsHorizontalIcon className="articulo-filter-modern__toggle-icon" />
            <span>{filtersExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
            <ChevronDownIcon 
              className={`articulo-filter-modern__chevron ${filtersExpanded ? 'articulo-filter-modern__chevron--up' : ''}`} 
            />
          </button>

          {/* Botón limpiar filtros */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="articulo-filter-modern__clear-btn"
              aria-label="Limpiar todos los filtros"
            >
              <XMarkIcon className="articulo-filter-modern__clear-icon" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Contenido de filtros */}
      <div className={`articulo-filter-modern__content ${filtersExpanded ? 'articulo-filter-modern__content--expanded' : ''}`}>
        {/* Barra de búsqueda */}
        <div className="articulo-filter-modern__search-section">
          <div className={`articulo-filter-modern__search-group ${searchFocused ? 'articulo-filter-modern__search-group--focused' : ''}`}>
            <MagnifyingGlassIcon className="articulo-filter-modern__search-icon" />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                if (value.trim() && value.length >= 2) {
                  saveSearchToHistory(value.trim());
                }
              }}
              className="articulo-filter-modern__search-input"
              disabled={isProcessing}
              onFocus={() => {
                setSearchFocused(true);
                setShowSuggestions(true);
              }}
              onBlur={() => {
                setSearchFocused(false);
                // Delay para permitir clicks en sugerencias
                setTimeout(() => setShowSuggestions(false), 150);
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="articulo-filter-modern__search-clear"
                aria-label="Limpiar búsqueda"
              >
                <XMarkIcon className="articulo-filter-modern__search-clear-icon" />
              </button>
            )}
          </div>

          {/* Sugerencias de búsqueda */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="articulo-filter-modern__suggestions">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="articulo-filter-modern__suggestion"
                >
                  <MagnifyingGlassIcon className="articulo-filter-modern__suggestion-icon" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="articulo-filter-modern__filters">
          <div className="articulo-filter-modern__filter-group">
            <label htmlFor="category-select" className="articulo-filter-modern__label">
              <FunnelIcon className="articulo-filter-modern__label-icon" />
              Categoría
            </label>
            <div className="articulo-filter-modern__select-wrapper">
              <select
                id="category-select"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="articulo-filter-modern__select"
                disabled={isProcessing}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="articulo-filter-modern__select-icon" />
            </div>
          </div>

          <div className="articulo-filter-modern__filter-group">
            <label htmlFor="sort-select" className="articulo-filter-modern__label">
              <AdjustmentsHorizontalIcon className="articulo-filter-modern__label-icon" />
              Ordenar por
            </label>
            <div className="articulo-filter-modern__select-wrapper">
              <select
                id="sort-select"
                value={orden}
                onChange={(e) => setOrden(e.target.value as 'precio-asc' | 'precio-desc' | 'az' | 'za')}
                className="articulo-filter-modern__select"
                disabled={isProcessing}
              >
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="az">Nombre: A-Z</option>
                <option value="za">Nombre: Z-A</option>
              </select>
              <ChevronDownIcon className="articulo-filter-modern__select-icon" />
            </div>
          </div>
        </div>

        {/* Indicador de procesamiento */}
        {isProcessing && (
          <div className="articulo-filter-modern__processing">
            <div className="articulo-filter-modern__spinner" />
            <span className="articulo-filter-modern__processing-text">Aplicando filtros...</span>
          </div>
        )}

        {/* Filtros activos */}
        {activeFilters.length > 0 && (
          <div className="articulo-filter-modern__active-filters">
            <span className="articulo-filter-modern__active-filters-label">Filtros activos:</span>
            <div className="articulo-filter-modern__active-filters-list">
              {activeFilters.map((filter, index) => (
                <div key={index} className="articulo-filter-modern__active-filter">
                  <span className="articulo-filter-modern__active-filter-label">{filter.label}:</span>
                  <span className="articulo-filter-modern__active-filter-value">{filter.value}</span>
                  <button
                    onClick={() => {
                      if (filter.type === 'search') setSearchTerm('');
                      if (filter.type === 'category') setCategoriaSeleccionada('');
                      if (filter.type === 'sort') setOrden('precio-asc');
                    }}
                    className="articulo-filter-modern__active-filter-remove"
                    aria-label={`Remover filtro ${filter.label}`}
                  >
                    <XMarkIcon className="articulo-filter-modern__active-filter-remove-icon" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticuloFilter;
