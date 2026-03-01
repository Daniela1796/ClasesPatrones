export interface LoteBase {
  idLote: number;
  idDonante: number;
  tipoDonante: string;
  alimento: string;
  clasificacion: string;
  fechaVencimiento: Date;
  fechaDeRecibido?: Date | null;
  estado: string;
  idEntrega?: number | null;
}

// Empresa agrega campos de precio
export interface LoteEmpresa extends LoteBase {
  cantidadDeCajas: number;
  precioPorCaja: number;
  costoTotal: number; // calculado: cantidad × precioCaja
}

// Voluntario solo tiene los campos base
export interface LoteVoluntario extends LoteBase {
  cantidadPorUnidad: number;
}
