import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("voluntario")
export class Voluntario {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "varchar", length: 255, unique: true })
  cedula!: string;

  @Column({ type: "varchar", length: 255 })
  proyectoSocial!: string;

  @Column({ type: "int" })
  user_id!: number;
}
