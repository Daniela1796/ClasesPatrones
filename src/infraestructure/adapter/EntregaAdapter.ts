import { Repository } from "typeorm";
import { Entrega } from "../../domain/Entrega";
import { EntregaEntity } from "../entities/Entrega";
import { EntregaPort } from "../../domain/EntregaPort";
import { AppDataSource } from "../config/data-base";

export class EntregaAdapter