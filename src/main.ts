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
  console.log("[OK] end cron job");
};

if (process.env.RUN_IMMEDIATELY === "true") {
  console.log("[OK] run immediately");
  fn();
}

const job = new CronJob(
  process.env.CRON_EXECUTION_TIME || "0 */12 * * *",
  fn, // onTick
  () => console.log("cron job is stopped"), // onComplete
  true
);

job.start();
