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

export interface LoteEmpresa extends LoteBase {
  cantidadDeCajas: number;
  precioPorCaja: number;
  costoTotal: number; 
}

export interface LoteVoluntario extends LoteBase {
  cantidadPorUnidad: number;
}
