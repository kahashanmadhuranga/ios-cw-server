import mongoose, { Schema } from "mongoose";

const WishListSchema = new Schema(
  {
    recipeId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const WishList = mongoose.model("wish_list", WishListSchema);
export default WishList;
