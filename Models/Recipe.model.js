import mongoose, { Schema } from "mongoose";

const RecipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [String],
    imageUrls: [String],
    steps: [String]
  },
  { timestamps: true }
);

const Recipe = mongoose.model("recipe", RecipeSchema);
export default Recipe;
