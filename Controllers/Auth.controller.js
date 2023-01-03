import createError from "http-errors";
import User from "../Models/User.model.js";
import { authSchema, authLoginSchema } from "../Validators/Auth.schema.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../Helpers/jwt_helper.js";
// import redisClient from "../Helpers/init_redis.js";

export async function register(req, res, next) {
  try {
    const result = await authSchema.validateAsync(req.body);
    const doesExist = await User.findOne({ email: result.email });
    if (doesExist)
      throw createError.Conflict(`${result.email} is already been registered`);
    const user = new User(result);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);
    res.send({
      accessToken,
      refreshToken,
      email: savedUser.email,
      first_name: savedUser.first_name,
      last_name: savedUser.last_name,
    });
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authLoginSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) throw createError.NotFound("User not registered");
    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch) throw createError.Unauthorized("Invalid username/password");
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res.send({
      accessToken,
      refreshToken,
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (err) {
    if (err.isJoi === true)
      return next(createError.BadRequest("Invalid username/password"));
    next(err);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);
    const newAccessToken = await signAccessToken(userId);
    const newRefreshToken = await signRefreshToken(userId);
    res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);
    // let result = await redisClient.DEL(userId);
    // console.log(result);
    res.sendStatus(204);
  } catch (err) {
    console.log(err.message);
    next(createError.InternalServerError());
  }
}

export default { register, login, refreshToken, logout };
