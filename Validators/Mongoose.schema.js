import createError from "http-errors";
import mongoose from "mongoose";

export const mongooseIdSchema = (id) => {
  if (!id) throw createError.BadRequest();
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw createError.UnprocessableEntity();
  return id;
};

export default { mongooseIdSchema };
