import Joi from "joi";

export type ReturnUpdateLoteData = {
  alimento: string;
  clasificacion: string;
  fechaVencimiento: Date;
};

export type ReturnUpdateLoteEmpresaData = ReturnUpdateLoteData & {
  cantidadCajas: number;
  precioPorCaja: number;
  costoTotal: number;
};

export type ReturnUpdateLoteVoluntarioData = ReturnUpdateLoteData & {
  cantidadPorUnidad: number;
};

type ValidationUpdateLoteEmpresaData = {
  error: Joi.ValidationError | undefined;
  value: ReturnUpdateLoteEmpresaData;
};

type ValidationUpdateLoteVoluntarioData = {
  error: Joi.ValidationError | undefined;
  value: ReturnUpdateLoteVoluntarioData;
};

export type ReturnUpdateFormatoLote =
  | ReturnUpdateLoteEmpresaData
  | ReturnUpdateLoteVoluntarioData;

function validateUpdateLoteEmpresaData(
  data: any,
): ValidationUpdateLoteEmpresaData {
  const schema = Joi.object({
    alimento: Joi.string()
      .trim()
      .min(3)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        "string.empty": "El alimento es requerido",
        "string.min": "El alimento debe tener al menos 3 caracteres",
        "string.pattern.base": "El alimento solo puede contener letras",
      }),

    clasificacion: Joi.string().valid("A", "B", "C", "D").optional().messages({
      "any.only": "La clasificación debe ser A, B, C o D",
      "any.required": "La clasificación es requerida",
    }),

    cantidadDeCajas: Joi.number().integer().min(1).optional().messages({
      "number.min": "La cantidad mínima es 1 caja",
      "any.required": "La cantidad de cajas es requerida",
    }),

    precioPorCaja: Joi.number().min(1).optional().messages({
      "number.min": "El precio mínimo es 1",
      "any.required": "El precio por caja es requerido",
    }),

    fechaVencimiento: Joi.date()
      .min(new Date(Date.now() + 48 * 60 * 60 * 1000)) // 👈 ahora + 48 horas
      .optional()
      .messages({
        "date.min":
          "La fecha de vencimiento debe ser al menos 48 horas desde ahora",
        "any.required": "La fecha de vencimiento es requerida",
      }),
  }).unknown(false);

  const { error, value } = schema.validate(data, { abortEarly: false });
  return { error, value: value as ReturnUpdateLoteEmpresaData };
}

function validateUpdateLoteVoluntarioData(
  data: any,
): ValidationUpdateLoteVoluntarioData {
  const schema = Joi.object({
    alimento: Joi.string()
      .trim()
      .min(3)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        "string.empty": "El alimento es requerido",
        "string.min": "El alimento debe tener al menos 3 caracteres",
        "string.pattern.base": "El alimento solo puede contener letras",
      }),

    clasificacion: Joi.string().valid("A", "B", "C", "D").optional().messages({
      "any.only": "La clasificación debe ser A, B, C o D",
      "any.required": "La clasificación es requerida",
    }),

    cantidadPorUnidad: Joi.number().integer().min(5).optional().messages({
      "number.min": "La cantidad mínima por alimento son 5 unidades",
      "any.required": "La cantidad de unidades de alimento es requerida",
    }),

    precioPorCaja: Joi.number().min(1).optional().messages({
      "number.min": "El precio mínimo es 1",
      "any.required": "El precio por caja es requerido",
    }),

    fechaVencimiento: Joi.date()
      .min(new Date(Date.now() + 48 * 60 * 60 * 1000)) // 👈 ahora + 48 horas
      .optional()
      .messages({
        "date.min":
          "La fecha de vencimiento debe ser al menos 48 horas desde ahora",
        "any.required": "La fecha de vencimiento es requerida",
      }),
  }).unknown(false);

  const { error, value } = schema.validate(data, { abortEarly: false });
  return { error, value: value as ReturnUpdateLoteVoluntarioData };
}

export const loadUpdateLoteRegistro = (
  data: any,
  rol: string,
): ReturnUpdateFormatoLote => {
  if (rol === "empresa") {
    const { error, value } = validateUpdateLoteEmpresaData(data);
    if (error) throw new Error(error.details.map((d) => d.message).join(", "));
    return value;
  }

  if (rol === "voluntario") {
    const { error, value } = validateUpdateLoteVoluntarioData(data);
    if (error) throw new Error(error.details.map((d) => d.message).join(", "));
    return value;
  }
  throw new Error("Tipo de entidad inválido, no fue posible registrar el lote");
};
