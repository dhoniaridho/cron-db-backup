import { config } from "dotenv";

config();

export const ENV = {
  DB_URL: process.env.DB_URL,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_REGION: process.env.S3_REGION,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  CRON_EXECUTION_TIME: process.env.CRON_EXECUTION_TIME || "0 */12 * * *",
  RUN_IMMEDIATELY: process.env.RUN_IMMEDIATELY,
};

Object.keys(ENV).forEach((key) => {
  if (!ENV[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});
