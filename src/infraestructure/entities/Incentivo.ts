import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("incentivo")
export class IncentivoEntity {
  @PrimaryGeneratedColumn()
  idIncentivo!: number;

  @Column({ type: "int" })
  idEmpresa!: number;

  @Column({ type: "int", array: true })
  lotesID!: number[];

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalDescuento!: number;

  @Column({ type: "varchar", length: 50, default: "Activo" })
  estado!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fechaCreacion!: Date;

  @Column({ type: "timestamp", nullable: true })
  fechaUso!: Date | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "idEmpresa" })
  user!: User;
}
