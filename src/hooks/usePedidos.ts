import { useEffect, useState } from 'react';
import { getPedidos, crearPedido, getPedidoById } from '../services/pedidosService';
import type { Pedido } from '../services/pedidosService';

interface UsePedidosResult {
  pedidos: Pedido[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  crear: (data: Partial<Pedido>) => Promise<Pedido | null>;
  getById: (id: string) => Promise<Pedido | null>;
}

export function usePedidos(): UsePedidosResult {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPedidos();
      setPedidos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const crear = async (data: Partial<Pedido>): Promise<Pedido | null> => {
    try {
      const pedido = await crearPedido(data);
      fetchPedidos(); // recarga la lista
      return pedido;
    } catch (err: any) {
      setError(err.message || 'Error al crear el pedido');
      return null;
    }
  };

  const getById = async (id: string): Promise<Pedido | null> => {
    try {
      return await getPedidoById(id);
    } catch (err: any) {
      setError(err.message || 'Error al obtener el pedido');
      return null;
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return { pedidos, loading, error, reload: fetchPedidos, crear, getById };
}
