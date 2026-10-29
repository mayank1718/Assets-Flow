import "dotenv/config.js";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI not defined");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}
if (!process.env.REDIS_HOST) {
  throw new Error("REDIS_HOST not defined");
}
if (!process.env.REDIS_PORT) {
  throw new Error("REDIS_PORT not defined");
}
if (!process.env.REDIS_PASSWORD) {
  throw new Error("REDIS_PASSWORD not defined");
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};
