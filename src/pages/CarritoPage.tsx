import { useCarrito } from '../hooks/useCarrito';
import type { CartItem } from '../hooks/useCarrito'; // Importación de solo tipo
import { usePedidos } from '../hooks/usePedidos'; 
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';

// Asumimos que tienes un ID de cliente/usuario disponible. 
// Esto podría venir de un contexto de autenticación, por ejemplo.
const ID_USUARIO_EJEMPLO = 'ID_CLIENTE_FICTICIO_123'; // Reemplazar con lógica real de autenticación

export function CarritoPage() {
  const { items, eliminarDelCarrito, actualizarCantidad, limpiarCarrito, totalItems, totalPrecio } = useCarrito();
  const { crear: crearPedido, loading: creandoPedido, error: errorPedido } = usePedidos(); // Cambiado a 'crear'
  const navigate = useNavigate();

  const handleCrearPedido = async () => {
    if (items.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const pedidoData = {
      usuario: ID_USUARIO_EJEMPLO, // O clienteId, según tu modelo de Pedido
      articulos: items.map(item => ({
        articulo: item.articulo._id,
        cantidad: item.cantidad,
        precioUnitario: Number(item.articulo.precio) // Asegúrate que el precio sea un número
      })),
      total: totalPrecio,
      estado: 'Pendiente', // Estado inicial del pedido
    };

    try {
      const pedidoCreado = await crearPedido(pedidoData);

      if (pedidoCreado) {
        alert('¡Pedido creado con éxito! ID: ' + pedidoCreado._id);
        limpiarCarrito();
        navigate(`/pedidos/${pedidoCreado._id}`); // O a una página de confirmación
      } else {
        // Si pedidoCreado es null, el error ya debería estar en errorPedido por el hook usePedidos
        // o fue un error no capturado por el hook antes de retornar null.
        const mensajeError = errorPedido || 'No se pudo crear el pedido. Intente de nuevo.';
        alert('Error al crear el pedido: ' + mensajeError);
      }
    } catch (err) {
      // Este catch es más para errores inesperados durante la ejecución de esta función,
      // ya que usePedidos debería manejar los errores de la API y ponerlos en errorPedido.
      console.error("Error inesperado en handleCrearPedido:", err);
      const displayError = errorPedido || (err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
      alert('Error al procesar el pedido: ' + displayError);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2>Tu carrito está vacío</h2>
        <p>Añade algunos productos para continuar.</p>
        <Link to="/articulos" className="btn btn-primary">Ver Artículos</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Carrito de Compras</h1>
      <div className="row">
        <div className="col-md-8">
          {items.map((item: CartItem) => (
            <div key={item.articulo._id} className="card mb-3">
              <div className="row g-0">
                <div className="col-md-3 d-flex align-items-center justify-content-center p-2">
                  <img 
                    src={item.articulo.imagenUrl || (item.articulo.imagenes && item.articulo.imagenes[0]) || '/vite.svg'} 
                    alt={item.articulo.nombre} 
                    className="img-fluid rounded-start" 
                    style={{ maxHeight: '100px', objectFit: 'contain' }}
                  />
                </div>
                <div className="col-md-9">
                  <div className="card-body">
                    <h5 className="card-title">{item.articulo.nombre}</h5>
                    <p className="card-text">
                      Precio: ${Number(item.articulo.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="d-flex align-items-center mb-2">
                      <button 
                        onClick={() => actualizarCantidad(item.articulo._id, item.cantidad - 1)} 
                        className="btn btn-outline-secondary btn-sm me-2"
                        disabled={item.cantidad <= 1}
                      >
                        <MinusCircleIcon width={20} />
                      </button>
                      <span>{item.cantidad}</span>
                      <button 
                        onClick={() => actualizarCantidad(item.articulo._id, item.cantidad + 1)} 
                        className="btn btn-outline-secondary btn-sm ms-2"
                        disabled={item.cantidad >= Number(item.articulo.stock)}
                      >
                        <PlusCircleIcon width={20} />
                      </button>
                      <button 
                        onClick={() => eliminarDelCarrito(item.articulo._id)} 
                        className="btn btn-outline-danger btn-sm ms-auto"
                      >
                        <TrashIcon width={20} />
                      </button>
                    </div>
                    <p className="card-text">
                      <small className="text-muted">Subtotal: ${ (Number(item.articulo.precio) * item.cantidad).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Resumen del Pedido</h5>
              <p>Total de artículos: {totalItems}</p>
              <h6 className="mb-3">Total: ${totalPrecio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h6>
              <button 
                className="btn btn-success w-100 mb-2" 
                onClick={handleCrearPedido} 
                disabled={creandoPedido}
              >
                {creandoPedido ? 'Procesando Pedido...' : 'Realizar Pedido'}
              </button>
              <button className="btn btn-outline-danger w-100" onClick={limpiarCarrito} disabled={creandoPedido}>
                Vaciar Carrito
              </button>
              {errorPedido && <p className="text-danger mt-2">Error: {errorPedido}</p>} {/* Acceder directamente a errorPedido */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarritoPage;
