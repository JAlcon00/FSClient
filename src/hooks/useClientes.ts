import { useEffect, useState } from 'react';
import { getClientes, crearCliente, getClienteById, actualizarCliente, eliminarCliente } from '../services/clientesService';
import type { Cliente } from '../services/clientesService';

interface UseClientesResult {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  crear: (data: Partial<Cliente>) => Promise<Cliente | null>;
  getById: (id: string) => Promise<Cliente | null>;
  actualizar: (id: string, data: Partial<Cliente>) => Promise<Cliente | null>;
  eliminar: (id: string) => Promise<boolean>;
}

export function useClientes(): UseClientesResult {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const crear = async (data: Partial<Cliente>): Promise<Cliente | null> => {
    try {
      const cliente = await crearCliente(data);
      fetchClientes();
      return cliente;
    } catch (err: any) {
      setError(err.message || 'Error al crear el cliente');
      return null;
    }
  };

  const getById = async (id: string): Promise<Cliente | null> => {
    try {
      return await getClienteById(id);
    } catch (err: any) {
      setError(err.message || 'Error al obtener el cliente');
      return null;
    }
  };

  const actualizar = async (id: string, data: Partial<Cliente>): Promise<Cliente | null> => {
    try {
      const cliente = await actualizarCliente(id, data);
      fetchClientes();
      return cliente;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el cliente');
      return null;
    }
  };

  const eliminar = async (id: string): Promise<boolean> => {
    try {
      await eliminarCliente(id);
      fetchClientes();
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el cliente');
      return false;
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return { clientes, loading, error, reload: fetchClientes, crear, getById, actualizar, eliminar };
}
