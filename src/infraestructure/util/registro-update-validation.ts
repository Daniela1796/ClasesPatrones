import joi from "joi";

export type ReturnRegistroActualizadoData = {
  usuario: string;
  email: string;
  password: string;
  localidad: string;
  contacto: string;
};

export type ReturnRegistroActualizadoEmpresaData =
  ReturnRegistroActualizadoData & {
    razonSocial: string;
    tipoEntidad: string;
  };

export type ReturnRegistroActualizadoEntidadData =
  ReturnRegistroActualizadoData & {
    razonSocial: string;
    tipoEntidad: string;
  };

export type ReturnRegistroActualizadoVoluntarioData =
  ReturnRegistroActualizadoData & {
    cedula: string;
    proyectoSocial: string;
  };

type ValidationEmpresaData = {
  error: joi.ValidationError | undefined;
  value: ReturnRegistroActualizadoEmpresaData;
};

type ValidationEntidadData = {
  error: joi.ValidationError | undefined;
  value: ReturnRegistroActualizadoEntidadData;
};

type ValidationVoluntarioData = {
  error: joi.ValidationError | undefined;
  value: ReturnRegistroActualizadoVoluntarioData;
};

export type ReturnFormatoRegistroActualizado =
  | ReturnRegistroActualizadoEmpresaData
  | ReturnRegistroActualizadoEntidadData
  | ReturnRegistroActualizadoVoluntarioData;

function validateRegistroActualizadoEmpresa(data: any): ValidationEmpresaData {
  const userSchema = joi
    .object({
      email: joi
        .string()
        .trim()
        .email({ tlds: { allow: false } })
        .optional()
        .messages({
          "string.base": `El correo debe ser un texto`,
          "string.empty": `El correo es requerido`,
          "string.email": `El correo debe tener un formato válido`,
        }),

      password: joi
        .string()
        .min(6)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
        .optional()
        .messages({
          "string.min": `La contraseña debe tener al menos 6 caracteres`,
          "string.pattern.base": `La contraseña debe contener al menos una letra y un número`,
          "string.empty": `La contraseña es requerida`,
        }),
      usuario: joi
        .string()
        .trim()
        .min(10)
        .pattern(/^[a-zA-Z\s]+$/)
        .optional()
        .messages({
          "string.base": `El nombre debe ser un texto`,
          "string.empty": `El nombre es requerido`,
          "string.min": `El nombre debe tener al menos 5 caracteres`,
          "string.pattern.base": `El nombre solo puede contener letras y espacios`,
        }),

      localidad: joi
        .string()
        .trim()
        .valid(
          "Usaquén",
          "Chapinero",
          "Santa Fe",
          "San Cristóbal",
          "Usme",
          "Tunjuelito",
          "Bosa",
          "Kennedy",
          "Fontibón",
          "Engativá",
          "Suba",
          "Barrios Unidos",
          "Teusaquillo",
          "Los Mártires",
          "Antonio Nariño",
          "Puente Aranda",
          "La Candelaria",
          "Rafael Uribe Uribe",
          "Ciudad Bolívar",
          "Sumapaz",
        )
        .optional()
        .messages({
          "any.only":
            "La localidad debe ser una de las 20 localidades de Bogotá",
          "string.empty": "La localidad es requerida",
          "any.required": "La localidad es requerida",
        }),

      contacto: joi
        .string()
        .trim()
        .pattern(/^\d{8,10}$/)
        .optional()
        .messages({
          "number.base": "El contacto debe ser un número",
          "number.min": "El contacto debe tener 10 dígitos",
          "number.max": "El contacto debe tener 10 dígitos",
          "any.required": "El contacto es requerido",
        }),

      razonSocial: joi
        .string()
        .trim()
        .min(10)
        .pattern(/^[a-zA-Z\s]+$/)
        .optional()
        .messages({
          "string.base": `El rol debe ser un texto: Empresa, Voluntario, Entidad`,
          "string.empty": `El rol es requerido`,
          "string.min": `El rol debe tener al menos 7 caracteres`,
          "string.pattern.base": `El rol solo puede contener letras`,
        }),

      tipoEntidad: joi
        .string()
        .trim()
        .valid("Privada", "Publica", "Mixta")
        .optional()
        .messages({
          "any.only": "El tipo de entidad no es válido",
          "string.empty": "El tipo de entidad es requerido",
          "any.required": "El tipo de entidad es requerido",
        }),
    })
    .unknown(false);

  const { error, value } = userSchema.validate(data, { abortEarly: false });

  return { error, value: value as ReturnRegistroActualizadoEmpresaData };
} //fin funcion empresas

//Entidad
function validateRegistroActualizadoEntidad(data: any): ValidationEntidadData {
  const userSchema = joi
    .object({
      email: joi
        .string()
        .trim()
        .email({ tlds: { allow: false } })
        .optional()
        .messages({
          "string.base": `El correo debe ser un texto`,
          "string.empty": `El correo es requerido`,
          "string.email": `El correo debe tener un formato válido`,
        }),

      password: joi
        .string()
        .min(6)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
        .optional()
        .messages({
          "string.min": `La contraseña debe tener al menos 6 caracteres`,
          "string.pattern.base": `La contraseña debe contener al menos una letra y un número`,
          "string.empty": `La contraseña es requerida`,
        }),
      usuario: joi
        .string()
        .trim()
        .min(10)
        .pattern(/^[a-zA-Z\s]+$/)
        .optional()
        .messages({
          "string.base": `El nombre debe ser un texto`,
          "string.empty": `El nombre es requerido`,
          "string.min": `El nombre debe tener al menos 5 caracteres`,
          "string.pattern.base": `El nombre solo puede contener letras y espacios`,
        }),

      localidad: joi
        .string()
        .trim()
        .valid(
          "Usaquén",
          "Chapinero",
          "Santa Fe",
          "San Cristóbal",
          "Usme",
          "Tunjuelito",
          "Bosa",
          "Kennedy",
          "Fontibón",
          "Engativá",
          "Suba",
          "Barrios Unidos",
          "Teusaquillo",
          "Los Mártires",
          "Antonio Nariño",
          "Puente Aranda",
          "La Candelaria",
          "Rafael Uribe Uribe",
          "Ciudad Bolívar",
          "Sumapaz",
        )
        .optional()
        .messages({
          "any.only":
            "La localidad debe ser una de las 20 localidades de Bogotá",
          "string.empty": "La localidad es requerida",
          "any.required": "La localidad es requerida",
        }),

      contacto: joi
        .string()
        .trim()
        .pattern(/^\d{8,10}$/)
        .optional()
        .messages({
          "number.base": "El contacto debe ser un número",
          "number.min": "El contacto debe tener 10 dígitos",
          "number.max": "El contacto debe tener 10 dígitos",
          "any.required": "El contacto es requerido",
        }),

      razonSocial: joi
        .string()
        .trim()
        .min(10)
        .pattern(/^[a-zA-Z\s]+$/)
        .optional()
        .messages({
          "string.base": `El rol debe ser un texto: Empresa, Voluntario, Entidad`,
          "string.empty": `El rol es requerido`,
          "string.min": `El rol debe tener al menos 7 caracteres`,
          "string.pattern.base": `El rol solo puede contener letras`,
        }),

      tipoEntidad: joi
        .string()
        .trim()
        .valid("Privada", "Publica", "Mixta")
        .optional()
        .messages({
          "any.only": "El tipo de entidad no es válido",
          "string.empty": "El tipo de entidad es requerido",
          "any.required": "El tipo de entidad es requerido",
        }),
    })
    .unknown(false); // No permitir campos adicionales

  const { error, value } = userSchema.validate(data, { abortEarly: false });

  return { error, value: value as ReturnRegistroActualizadoEntidadData };
}

//Voluntario
function validateRegistroActualizadoVoluntario(
  data: any,
): ValidationVoluntarioData {
  const userSchema = joi
    .object({
      usuario: joi
        .string()
        .trim()
        .min(10)
        .pattern(/^[a-zA-Z\s]+$/)
        .optional()
        .messages({
          "string.base": `El nombre debe ser un texto`,
          "string.empty": `El nombre es requerido`,
          "string.min": `El nombre debe tener al menos 5 caracteres`,
          "string.pattern.base": `El nombre solo puede contener letras y espacios`,
        }),

      email: joi
        .string()
        .trim()
        .email({ tlds: { allow: false } })
        .optional()
        .messages({
          "string.base": `El correo debe ser un texto`,
          "string.empty": `El correo es requerido`,
          "string.email": `El correo debe tener un formato válido`,
        }),

      password: joi
        .string()
        .min(6)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
        .optional()
        .messages({
          "string.min": `La contraseña debe tener al menos 6 caracteres`,
          "string.pattern.base": `La contraseña debe contener al menos una letra y un número`,
          "string.empty": `La contraseña es requerida`,
        }),

      localidad: joi
        .string()
        .trim()
        .valid(
          "Usaquén",
          "Chapinero",
          "Santa Fe",
          "San Cristóbal",
          "Usme",
          "Tunjuelito",
          "Bosa",
          "Kennedy",
          "Fontibón",
          "Engativá",
          "Suba",
          "Barrios Unidos",
          "Teusaquillo",
          "Los Mártires",
          "Antonio Nariño",
          "Puente Aranda",
          "La Candelaria",
          "Rafael Uribe Uribe",
          "Ciudad Bolívar",
          "Sumapaz",
        )
        .optional()
        .messages({
          "any.only":
            "La localidad debe ser una de las 20 localidades de Bogotá",
          "string.empty": "La localidad es requerida",
          "any.required": "La localidad es requerida",
        }),

      contacto: joi
        .string()
        .trim()
        .pattern(/^\d{8,10}$/)
        .optional()
        .messages({
          "number.base": "El contacto debe ser un número",
          "number.min": "El contacto debe tener 10 dígitos",
          "number.max": "El contacto debe tener 10 dígitos",
          "any.required": "El contacto es requerido",
        }),

      cedula: joi
        .string()
        .trim()
        .pattern(/^\d{8,10}$/)
        .optional()
        .messages({
          "string.base": `La cédula solo pueden ser números`,
          "string.empty": `La cédula es requerida`,
          "string.pattern.base": `La cédula debe tener entre 8 y 10 dígitos`,
        }),

      proyectoSocial: joi
        .string()
        .trim()
        .pattern(/^[a-zA-Z\s]+$/)
        .optional()
        .messages({
          "string.base": `El proyecto social debe ser un texto`,
          "string.empty": `El proyecto social es obligatorio`,
        }),
    })
    .unknown(false);

  const { error, value } = userSchema.validate(data, { abortEarly: false });
  return { error, value: value as ReturnRegistroActualizadoVoluntarioData };
}

//Cargar informacación de registro actualizado
export const loadRegistroActualizadoData = (
  data: any,
  rol: string,
): ReturnFormatoRegistroActualizado => {
  if (rol === "empresa") {
    const { error, value } = validateRegistroActualizadoEmpresa(data);
    if (error) throw new Error(error.details.map((d) => d.message).join(", "));
    return value;
  }

  if (rol === "entidad") {
    const { error, value } = validateRegistroActualizadoEntidad(data);
    if (error) throw new Error(error.details.map((d) => d.message).join(", "));
    return value;
  }

  if (rol === "voluntario") {
    const { error, value } = validateRegistroActualizadoVoluntario(data);
    if (error) throw new Error(error.details.map((d) => d.message).join(", "));
    return value;
  }

  throw new Error("Rol inválido, no fue posible actualizar el perfil");
};
