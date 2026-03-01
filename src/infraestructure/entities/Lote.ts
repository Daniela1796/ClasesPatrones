import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("lote")
export class LoteEntity {
  @PrimaryGeneratedColumn()
  idLote!: number;

  @Column({ type: "int" })
  idDonante!: number;

  @Column({ type: "varchar", length: 50 })
  tipoDonante!: string;

  @Column({ type: "varchar", length: 50 })
  alimento!: string;

  @Column({ type: "char", length: 1 })
  clasificacion!: string;

  @Column({ type: "int", nullable: true })
  cantidadDeCajas!: number ;

  @Column({ type: "int", nullable: true })
  cantidadPorUnidad!: number ;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  precioPorCaja!: number ;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  costoTotal!: number ;

  @Column({ type: "date" })
  fechaVencimiento!: Date;

  @Column({ type: "date", nullable: true })
  fechaRecibido!: Date | null;

  @Column({ type: "varchar", length: 50, default: "En proceso" })
  estado!: string;

  @Column({ type: "int", nullable: true })
  idEntrega!: number | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "idDonante" })
  user!: User;
}
