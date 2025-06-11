import { useState, useEffect, useCallback } from 'react';
import type { Articulo } from '../services/articulosService';

export interface CartItem {
  articulo: Articulo;
  cantidad: number;
}

interface UseCarritoResult {
  items: CartItem[];
  agregarAlCarrito: (articulo: Articulo, cantidad?: number) => void;
  eliminarDelCarrito: (articuloId: string) => void;
  actualizarCantidad: (articuloId: string, nuevaCantidad: number) => void;
  limpiarCarrito: () => void;
  totalItems: number;
  totalPrecio: number;
}

const CARRITO_STORAGE_KEY = 'carrito_tienda';

export function useCarrito(): UseCarritoResult {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const storedItems = localStorage.getItem(CARRITO_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error("Error al cargar el carrito desde localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [items]);

  const agregarAlCarrito = useCallback((articulo: Articulo, cantidad: number = 1) => {
    setItems(prevItems => {
      const itemExistente = prevItems.find(i => i.articulo._id === articulo._id);
      if (itemExistente) {
        return prevItems.map(i =>
          i.articulo._id === articulo._id
            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, Number(articulo.stock)) } // Respetar stock
            : i
        );
      }
      return [...prevItems, { articulo, cantidad: Math.min(cantidad, Number(articulo.stock)) }];
    });
  }, []);

  const eliminarDelCarrito = useCallback((articuloId: string) => {
    setItems(prevItems => prevItems.filter(i => i.articulo._id !== articuloId));
  }, []);

  const actualizarCantidad = useCallback((articuloId: string, nuevaCantidad: number) => {
    setItems(prevItems =>
      prevItems.map(i => {
        if (i.articulo._id === articuloId) {
          const cantidadValida = Math.max(1, Math.min(nuevaCantidad, Number(i.articulo.stock))); // Mínimo 1, máximo stock
          return { ...i, cantidad: cantidadValida };
        }
        return i;
      }).filter(i => i.cantidad > 0) // Eliminar si la cantidad es 0 o menos (aunque ya se controla arriba)
    );
  }, []);

  const limpiarCarrito = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.cantidad, 0);
  
  const totalPrecio = items.reduce((total, item) => {
    return total + (Number(item.articulo.precio) * item.cantidad);
  }, 0);

  return {
    items,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    limpiarCarrito,
    totalItems,
    totalPrecio,
  };
}
