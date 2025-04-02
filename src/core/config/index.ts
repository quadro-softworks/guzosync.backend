// src/core/config/index.ts
import dotenv from "dotenv";
dotenv.config();

const config = {
  // ... other config
  api: {
    basePath: process.env.API_BASE_PATH || "/api",
  },
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  },
  hashing: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
  },
  mongo: {
    uri: process.env.MONGO_URI,
  },
  nodeEnv: process.env.NODE_ENV || "development",
};

// Basic validation
if (!config.jwt.secret) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}
if (isNaN(config.hashing.saltRounds)) {
  console.error("FATAL ERROR: BCRYPT_SALT_ROUNDS must be a number.");
  process.exit(1);
}

export default config;
