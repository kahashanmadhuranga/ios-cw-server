import express, { json, urlencoded } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import createError from "http-errors";
import AuthRoute from "./Routes/Auth.route.js";
import RecipeRoute from "./Routes/Recipe.route.js";
import WishListRoute from "./Routes/WishList.route.js";
import morgan from "morgan";
import "./Helpers/init_mongodb.js";
// import "./Helpers/init_redis.js";
import { verifyAccessToken } from "./Helpers/jwt_helper.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const APP = express();

APP.use(morgan("dev"));
APP.use(cors());
APP.use(json());
APP.use(urlencoded({ extended: true }));
APP.use("/auth", AuthRoute);
APP.use("/recipes", RecipeRoute);
APP.use("/wishlists", WishListRoute);

APP.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

APP.get("/", (req, res) => {
  res.send("OK");
});

APP.use(async (req, res, next) => {
  next(createError.NotFound());
});

APP.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
