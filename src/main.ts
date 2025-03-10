import { CronJob } from "cron";
import { dumpDatabase, getDatabases, upload } from "./lib";
import { ENV } from "./config";

const fn = async function () {
  console.log("[OK] start backup database");
  const db = ENV.DB_URL;

  const databases = getDatabases(db);
  for (const database of databases) {
    console.log("[OK] start dump database", database);
    const file = await dumpDatabase(ENV.DB_URL, database);
    console.log("[OK] dump database", database);
    await upload(file, database);
    console.log("[OK] upload database", database);
  }
  console.log("[OK] end backup database");
};

if (ENV.RUN_IMMEDIATELY === "true") {
  console.log("[OK] run immediately");
  fn();
}

const job = new CronJob(
  ENV.CRON_EXECUTION_TIME || "0 */12 * * *",
  fn, // onTick
  () => console.log("cron job is stopped"), // onComplete
  true
);

job.start();
console.log("[OK] app started");

process.on("SIGINT", () => {
  job.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  job.stop();
  process.exit(0);
});
