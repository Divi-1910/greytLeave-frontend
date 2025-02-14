import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis();

redis.on("error", (err) => console.error("Redis Client Error", err));
redis.on("connect", () => console.log("Redis Client Connected"));

export default redis;
