import { Incentivo } from "../Entities/Incentivo";

export interface IncentivoPort {
  createIncentivo(data: Omit<Incentivo, "idIncentivo">): Promise<number>;
  updateIncentivo(id: number, incentivo: Partial<Incentivo>): Promise<boolean>;
  deleteIncentivo(id: number): Promise<boolean>;

  getIncentivoById(idIncentivo: number): Promise<Incentivo | null>;
  getIncentivosByEmpresa(idEmpresa: number): Promise<Incentivo[]>;
  confirmarUsoIncentivo(id: number): Promise<boolean>;
}
