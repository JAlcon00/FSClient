import { useEffect, useState } from 'react';
import { getCategorias } from '../services/categoriasService';
import type { Categoria } from '../services/categoriasService';

interface UseCategoriasResult {
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useCategorias(): UseCategoriasResult {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return { categorias, loading, error, reload: fetchCategorias };
}
