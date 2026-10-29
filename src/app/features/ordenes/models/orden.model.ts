export interface DetalleOrden {
  id: number;
  servicioId: number;
  servicioCodigo: string;
  servicioNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
export interface Orden {
  id: number;
  numero: string;
  fecha: string;
  vehiculoId: number;
  placa: string;
  clienteNombre: string;
  kilometraje: number;
  estado: string;
  total: number;
  usuarioRegistro: string;
  motivoAnulacion: string | null;
  detalles: DetalleOrden[];
}
export interface OrdenRequest {
  vehiculoId: number;
  kilometraje: number;
  detalles: { servicioId: number; cantidad: number }[];
}
