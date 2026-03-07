import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { Empresa } from "../entities/Empresa";
import { Voluntario } from "../entities/Voluntario";
import { Entidad } from "../entities/Entidad";
import { EntregaEntity } from "../entities/Entrega";
import envs from "../config/enviroment-vars";
import { LoteEntity } from "../entities/Lote";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: String(envs.DB_HOST),
  port: Number(envs.DB_PORT),
  username: String(envs.DB_USER),
  password: String(envs.DB_PASSWORD),
  database: String(envs.DB_NAME),
  synchronize: true,
  logging: false,
  entities: [User, Empresa, Voluntario, Entidad, LoteEntity, EntregaEntity],
  ssl: {
    rejectUnauthorized: true,
  },
});

//Conexión a base de datos

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Conectado a la base de datos Neon");
  } catch (error) {
    console.error("Error al conectar a la base de datos: ", error);
    process.exit(1);
  }
};
