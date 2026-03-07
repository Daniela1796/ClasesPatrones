export interface Incentivo {
  idIncentivo: number;
  idEmpresa: number;
  lotesID: number[];
  totalDescuento: number;
  estado: string;
  fechaCreacion: Date;
  fechaUso?: Date | null;
}
