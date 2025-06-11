import type { Articulo } from '../../../services/articulosService';
import { useState } from 'react';
import { ShoppingCartIcon, CheckIcon, HeartIcon } from '@heroicons/react/24/solid'; // Agregado HeartIcon aquí
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
// Asegúrate de que Articulos.css o un CSS global que contenga .articulo-card-modern esté importado en un nivel superior,
// o importa '../../../styles/Articulos.css'; aquí si es específico.

interface ArticuloCardProps {
  articulo: Articulo;
  onClick?: () => void;
  onAddToCart?: (articulo: Articulo) => void;
  onToggleFavorite?: (articulo: Articulo) => void;
  isFavorite?: boolean;
}

export function ArticuloCard({ articulo, onClick, onAddToCart, onToggleFavorite, isFavorite = false }: ArticuloCardProps) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart && Number(articulo.stock) > 0 && !loading && !added) {
      setLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simula loading
        onAddToCart(articulo);
        setAdded(true);
        setTimeout(() => {
          setAdded(false);
          setLoading(false);
        }, 2000);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(articulo);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(true);
    setImageError(true);
  };

  const stockDisponible = Number(articulo.stock) > 0;

  return (
    <div
      className="articulo-card-modern" // Clase principal para la tarjeta moderna
      onClick={onClick}
      // Se eliminan los estilos en línea, se manejarán por CSS
    >
      <div className="articulo-card-modern__image-container">
        {/* Botón de favoritos */}
        <button
          onClick={handleToggleFavorite}
          className={`articulo-card-modern__favorite-btn ${isFavorite ? 'articulo-card-modern__favorite-btn--active' : ''}`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isFavorite ? 
            <HeartIcon className="articulo-card-modern__favorite-icon" /> : // Restaurado HeartIcon
            <HeartOutlineIcon className="articulo-card-modern__favorite-icon" />
          }
        </button>
        
        {!imageLoaded && <div className="shimmer articulo-card-modern__image-shimmer" />}
        {imageError ? (
          <div className="articulo-card-modern__image-error">
            📷 Imagen no disponible
          </div>
        ) : (
          <img
            src={articulo.imagenUrl || (articulo.imagenes && articulo.imagenes[0]) || '/vite.svg'}
            alt={articulo.nombre}
            className="articulo-card-modern__image"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
          />
        )}
      </div>
      <div className="articulo-card-modern__content">
        <div> {/* Contenedor para título y descripción para empujar el botón hacia abajo si es necesario */} 
          <h3 className="articulo-card-modern__title">{articulo.nombre}</h3>
          <p className="articulo-card-modern__description">{articulo.descripcion || 'Descripción no disponible'}</p>
        </div>
        
        <div> {/* Contenedor para precio, stock y botón */} 
          <div className="articulo-card-modern__price-stock">
            <span className="articulo-card-modern__price">
              ${Number(articulo.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className={`articulo-card-modern__stock-text ${stockDisponible ? 'articulo-card-modern__stock-text--available' : 'articulo-card-modern__stock-text--unavailable'}`}>
            {stockDisponible ? `En stock: ${articulo.stock}` : 'Agotado'}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!stockDisponible || loading}
            className={`articulo-card-modern__button ${
              added ? 'articulo-card-modern__button--added' : 'articulo-card-modern__button--add'
            } ${loading ? 'articulo-card-modern__button--loading' : ''}`}
            aria-label={added ? 'Producto agregado al carrito' : 'Agregar producto al carrito'}
          >
            {loading ? (
              <>
                <span>Agregando...</span>
              </>
            ) : (
              <>
                {added ? 
                  <CheckIcon className="articulo-card-modern__button-icon" /> : 
                  <ShoppingCartIcon className="articulo-card-modern__button-icon" />
                }
                <span>{added ? 'Agregado' : 'Agregar al carrito'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArticuloCard;
