import Joi from "joi";

export const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
  first_name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

export default { authSchema, authLoginSchema };
