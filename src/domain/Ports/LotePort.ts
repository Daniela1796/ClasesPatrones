import { LoteBase, LoteEmpresa, LoteVoluntario } from "../Entities/Lote";

export interface LotePort {
  //Empresas
  createLoteEmpresa(data: Omit<LoteEmpresa, "idLote">): Promise<number>;
  updateLoteEmpresa(id: number, lote: Partial<LoteEmpresa>): Promise<boolean>;

  //Voluntarios
  createLoteVoluntarios(data: Omit<LoteVoluntario, "idLote">): Promise<number>;
  updateLoteVoluntario(
    id: number,
    lote: Partial<LoteVoluntario>,
  ): Promise<boolean>;

  //
  deleteLote(idLote: number): Promise<boolean>;
  getLoteById(idLote: number): Promise<LoteBase | null>;
  getLotesByDonante(idDonante: number): Promise<LoteBase[]>;
  getLotesByClasificacion(clasificacion: string): Promise<LoteBase[]>; // para priorización
  getLotesDisponibles(): Promise<LoteBase[]>;
  updateLoteEstado(id: number, estado: string, fecha?:Date): Promise<boolean>; //Actualizar datos cuando la donación sea exitosa
}
