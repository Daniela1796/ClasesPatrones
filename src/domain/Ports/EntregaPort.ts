import { Entrega } from "../Entities/Entrega";

export interface EntregaPort {

  createEntrega(data: Omit<Entrega, "idEntrega">): Promise<number>;
  updateEntrega(id: number, entrega: Partial<Entrega>): Promise<boolean>;
  deleteEntrega(id: number): Promise<boolean>;

  getEntregaById(idEntrega: number): Promise<Entrega | null>;
  //getEntregaBySolicitante(idSolicitante: number): Promise<Entrega[]>;
  //getEntregaByLote(idLote: number): Promise<Entrega[]>;
  //getEntregaByEstado(estado: string): Promise<Entrega[]>;
  confirmarEntrega(id: number): Promise<boolean>;
}
