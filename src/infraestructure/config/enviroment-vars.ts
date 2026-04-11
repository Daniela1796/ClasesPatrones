import joi, { string } from "joi";
import dotenv from "dotenv";

dotenv.config();

export type ReturnEnviromentVars = {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
};

type ValidationEnviromentVars = {
  error: joi.ValidationError | undefined;
  value: ReturnEnviromentVars;
};

function validateEnvVars(vars: NodeJS.ProcessEnv): ValidationEnviromentVars {
  const envSchema = joi
    .object({
      PORT: joi.number().required(),
      DB_HOST: joi.string().required(),
      DB_PORT: joi.number().default(5432),
      DB_USER: joi.string().required(),
      DB_PASSWORD: joi.string().allow("").optional(),
      DB_NAME: joi.string().default("patterns_users"),
    })
    .unknown(true);

  const { error, value } = envSchema.validate(vars);
  return { error, value };
}

const loadEnvVars = (): ReturnEnviromentVars => {
  //Validar los datos
  const result = validateEnvVars(process.env);

  if (result.error) {
    throw new Error(result.error.message);
  }

  const value = result.value;

  return {
    PORT: value.PORT,
    DB_HOST: value.DB_HOST,
    DB_PORT: value.DB_PORT,
    DB_USER: value.DB_USER,
    DB_PASSWORD: value.DB_PASSWORD,
    DB_NAME: value.DB_NAME,
  };
};

const envs = loadEnvVars();

export default envs;
