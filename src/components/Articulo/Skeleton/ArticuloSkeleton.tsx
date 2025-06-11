// ArticuloSkeleton.tsx - Componente de esqueleto de carga para los artículos

interface ArticuloSkeletonProps {
  count?: number;
}

export function ArticuloSkeleton({ count = 8 }: ArticuloSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="articulo-col">
          <div className="articulo-card-modern skeleton-card">
            <div className="articulo-card-modern__image-container">
              <div className="shimmer" style={{ width: '100%', height: '100%' }} />
              {/* Skeleton del botón de favoritos */}
              <div className="articulo-card-modern__favorite-btn" style={{ background: 'rgba(0,0,0,0.05)' }}>
                <div className="shimmer" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
              </div>
            </div>
            <div className="articulo-card-modern__content">
              <div>
                <div className="skeleton-title shimmer" />
                <div className="skeleton-description">
                  <div className="shimmer skeleton-text" />
                  <div className="shimmer skeleton-text" />
                  <div className="shimmer skeleton-text skeleton-text--short" />
                </div>
              </div>
              
              <div>
                <div className="articulo-card-modern__price-stock">
                  <div className="shimmer skeleton-price" />
                  <div className="shimmer skeleton-stock-icon" />
                </div>
                <div className="shimmer skeleton-stock-text" />
                <div className="shimmer skeleton-button" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ArticuloSkeleton;
