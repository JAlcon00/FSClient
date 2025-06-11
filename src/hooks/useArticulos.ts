import { useEffect, useState } from 'react';
import { getArticulos } from '../services/articulosService';
import type { Articulo } from '../services/articulosService';

interface UseArticulosResult {
  articulos: Articulo[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useArticulos(): UseArticulosResult {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticulos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticulos();
      setArticulos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los artículos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  return { articulos, loading, error, reload: fetchArticulos };
}
