import Joi from "joi";

export const recipeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  ingredients: Joi.array(),
  imageUrls: Joi.array(),
  steps: Joi.array(),
  type: Joi.string().valid("BREAKFAST", "LUNCH", "DINNER").required()
});

export const typeValidateSchema = Joi.object({
  type: Joi.string().valid("BREAKFAST", "LUNCH", "DINNER")
})

export default { recipeSchema, typeValidateSchema };
