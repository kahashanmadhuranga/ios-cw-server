import Joi from "joi";

export const wishListSchema = Joi.object({
  userId: Joi.string().required(),
  recipeId: Joi.string().required(),
});

export default { wishListSchema };