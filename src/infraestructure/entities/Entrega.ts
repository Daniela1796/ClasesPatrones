import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { LoteEntity } from "./Lote";

@Entity("entrega")
export class EntregaEntity {
  @PrimaryGeneratedColumn()
  idEntrega!: number;

  @Column({ type: "int" })
  idLote!: number;

  @Column({ type: "int" })
  idSolicitante!: number;

  @Column({ type: "varchar", length: 50 })
  tipoSolicitante!: string;

  @Column({ type: "varchar", length: 50, default: "Activa" })
  estado!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fechaSolicitud!: Date;

  @Column({ type: "timestamp", nullable: true })
  fechaRecogida!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  fechaConfirmacion!: Date | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "idSolicitante" })
  user!: User;

  @ManyToOne(() => LoteEntity)
  @JoinColumn({ name: "idLote" })
  lote!: LoteEntity;
}
