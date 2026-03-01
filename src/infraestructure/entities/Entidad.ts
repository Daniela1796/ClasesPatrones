import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("entidad")
export class Entidad {
  @PrimaryGeneratedColumn()
  id_user!: number;

  @Column({ type: "varchar", length: 255, unique: true })
  nit!: string;

  @Column({ type: "varchar", length: 255 })
  razonSocial!: string;

  @Column({ type: "varchar", length: 255 })
  tipoEntidad!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "int" })
  user_id!: number;
}
