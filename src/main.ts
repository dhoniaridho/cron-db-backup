import { config } from "dotenv";
import { CronJob } from "cron";
import { dumpDatabase, getDatabases, upload } from "./lib";

config();

const fn = async function () {
  console.log("[OK] start cron job");
  const databases = getDatabases(process.env.DB_URL);
  for (const database of databases) {
    console.log("[OK] start dump database", database);
    const file = await dumpDatabase(process.env.DB_URL, database);
    console.log("[OK] dump database", database);
    await upload(file, database);
    console.log("[OK] upload database", database);
  }
};

if (process.env.RUN_IMMEDIATELY === "true") {
  console.log("[OK] run immediately");
  fn();
}

const job = new CronJob(
  "0 0 * * *", // run every day
  fn, // onTick
  () => console.log("cron job is stopped"), // onComplete
  true
);

job.start();
