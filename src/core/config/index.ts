// src/core/config/index.ts
import dotenv from 'dotenv';
dotenv.config();

const config = {
  // ... other config
  api: {
    basePath: process.env.API_BASE_PATH,
  },
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  hashing: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  },
  mongo: {
    uri: process.env.MONGO_URI,
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true', // Convert string 'true' to boolean
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    from: process.env.EMAIL_FROM || 'no-reply@localhost',
  },
  clientUrl: process.env.CLIENT_URL,
};

// Basic validation
if (!config.jwt.secret) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}
if (isNaN(config.hashing.saltRounds)) {
  console.error('FATAL ERROR: BCRYPT_SALT_ROUNDS must be a number.');
  process.exit(1);
}
// Basic validation for email config (optional but good)
if (!config.email.host || !config.email.auth.user || !config.email.auth.pass) {
  console.warn(
    'Warning: Email service is not fully configured. Password reset emails may not send.',
  );
  // Depending on requirements, you might want to make this a fatal error:
  // console.error("FATAL ERROR: Email service configuration is missing."); process.exit(1);
}
if (!config.clientUrl) {
  console.warn(
    'Warning: CLIENT_URL is not set. Password reset links may be incorrect.',
  );
}

export default config;
