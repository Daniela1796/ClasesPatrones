import joi from "joi";

export type ReturnLoginData = {
  email: string;
  password: string;
};

type ValidationUserData = {
  error: joi.ValidationError | undefined;
  value: ReturnLoginData;
};

function validateUserData(data: any): ValidationUserData {
  const userSchema = joi
    .object({
      email: joi
        .string()
        .trim()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.base": `El correo debe ser un texto`,
          "string.empty": `El correo es requerido`,
          "string.email": `El correo debe tener un formato válido`,
        }),

      password: joi
        .string()
        .min(6)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        .required()
        .messages({
          "string.min": `La contraseña debe tener al menos 6 caracteres`,
          "string.pattern.base": `La contraseña debe contener al menos una letra y un número`,
          "string.empty": `La contraseña es requerida`,
        }),
    })
    .unknown(false); // No permitir campos adicionales

  const { error, value } = userSchema.validate(data, { abortEarly: false });

  return { error, value: value as ReturnLoginData };
}

export const loadLoginData = (data: any): ReturnLoginData => {
  const result = validateUserData(data);

  if (result.error) {
    //Une todos los mensajes en una sola cadena
    const message = result.error.details.map((d) => d.message).join(", ");
    throw new Error(message);
  }

  return result.value;
};
