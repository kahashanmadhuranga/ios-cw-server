import jwt from "jsonwebtoken";
import createError from "http-errors";
// import radisClient from "./init_redis.js";

export function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: process.env.ACCESS_TOKEN_EXPIER,
      issuer: process.env.ISSUER,
      audience: userId,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
}

export function signRefreshToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: process.env.REFRESH_TOKEN_EXPIER,
      issuer: process.env.ISSUER,
      audience: userId,
    };
    jwt.sign(payload, secret, options, async (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }
      resolve(token);
      // try {
      //   await radisClient.SET(userId, token, { EX: 365 * 42 * 60 * 60 });
      //   resolve(token);
      // } catch (error) {
      //   console.log(error.message);
      //   reject(createError.InternalServerError());
      // }
    });
  });
}

export function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next(createError.Unauthorized());
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
}

export function verifyRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        if (err) return reject(createError.Unauthorized());
        const userId = payload.aud;
        resolve(userId);
        // try {
        //   const token = await redisClient.GET(userId);
        //   if (refreshToken === token) return resolve(userId);
        //   reject(createError.Unauthorized());
        // } catch (error) {
        //   console.log(error.message);
        //   reject(createError.InternalServerError());
        // }
      }
    );
  });
}

export default { signAccessToken, signRefreshToken, verifyAccessToken };
