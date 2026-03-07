import Joi from "joi";

export type ReturnUpdateEntregaData = {
  idLote: number;
  cantidadSolicitada: number;
  fechaRecogida?: Date | null;
};

type ValidationEntregaData = {
  error: Joi.ValidationError | undefined;
  value: ReturnUpdateEntregaData;
};

function validateUpdateEntregaData(
  data: any,
  isUpdated: boolean,
): ValidationEntregaData {
  const schema = Joi.object({
    idLote: Joi.number().integer().min(1).optional().messages({
      "number.base": "El ID del lote debe ser un número",
      "number.integer": "El ID del lote debe ser un número entero",
      "number.min": "El ID del lote debe ser mayor a 0",
      "any.required": "El ID del lote es requerido",
    }),

    cantidadSolicitada: Joi.number().integer().min(1).optional().messages({
      "number.base": "La cantidad solicitada debe ser un número",
      "number.integer": "La cantidad solicitada debe ser un número entero",
      "number.min": "La cantidad solicitada debe ser al menos 1",
      "any.required": "La cantidad solicitada es requerida",
    }),

    fechaRecogida: Joi.date()
      .min(new Date(Date.now() + 24 * 60 * 60 * 1000))
      .max(new Date(Date.now() + 72 * 60 * 60 * 1000))
      .optional()
      .messages({
        "date.base": "La fecha de recogida debe ser una fecha válida",
        "date.min": "La fecha de recogida debe ser mínimo 24 horas desde ahora",
        "date.max": "La fecha de recogida debe ser máximo 72 horas desde ahora",
      }),
  }).unknown(false);

  const { error, value } = schema.validate(data, {
    abortEarly: false,
    context: { isUpdated },
  });
  return { error, value: value as ReturnUpdateEntregaData };
}

export const loadUpdateEntregaData = (data: any): ReturnUpdateEntregaData => {
  const result = validateUpdateEntregaData(data, true);

  if (result.error) {
    const message = result.error.details.map((d) => d.message).join(", ");
    throw new Error(message);
  }

  return result.value;
};
