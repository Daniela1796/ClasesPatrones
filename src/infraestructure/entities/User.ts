import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id_user!: number;

  @Column({ type: "varchar", length: 255, unique: true })
  email_user!: string;

  @Column({ type: "varchar", length: 255 })
  password_user!: string;

  @Column({ type: "varchar", length: 255 })
  rol!: string;

  @Column({ type: "varchar", length: 255 })
  name_user!: string;

  @Column({ type: "varchar", length: 255 })
  localidad!: string;

  @Column({ type: "varchar", length: 10 })
  contacto!: string;

  @Column({ type: "boolean", default: true })
  status_user!: boolean;
}
