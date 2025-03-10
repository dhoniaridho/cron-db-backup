import { DateTime } from "luxon";
import { exec, execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse } from "pg-connection-string";
import * as AWS from "@aws-sdk/client-s3";
import { config } from "dotenv";
config();

export const getDatabases = (connection: string) => {
  const { host, port, user, password } = parse(connection);

  const cmd = `PGPASSWORD=${password} psql -U ${user} -h ${host} -p ${port} -d postgres -t -c "SELECT datname FROM pg_database WHERE datistemplate = false;"`;
  return execSync(cmd, { encoding: "utf-8" })
    .trim()
    .split("\n")
    .map((db) => db.trim())
    .filter((db) => db);
};

export const dumpDatabase = async (
  connnection: string,
  database?: string
): Promise<Buffer<ArrayBufferLike>> => {
  return new Promise((resolve, reject) => {
    const date = DateTime.now().setZone("utc").toFormat("yyyy-MM-dd-hh-mm-ss");
    const { host, port, user, password } = parse(connnection);
    const file = `/tmp/${database}-${date}.sql`;
    const cmd = `PGPASSWORD=${password} pg_dump -U ${user} -h ${host} -p ${port} -d ${database} -f ${file}`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(error, "error");
        reject(error);
      }
      if (stderr) {
        console.log(stderr, "stderr");
        reject(stderr);
      }
      console.log(file, "stdout");
      const buffer = readFileSync(file);
      resolve(buffer);
    });
  });
};

export const s3 = new AWS.S3({
  region: process.env.S3_REGION as string,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
  endpoint: process.env.S3_ENDPOINT as string,
});

export const upload = async (buffer: Buffer<ArrayBufferLike>, path: string) => {
  const date = DateTime.now().setZone("utc").toFormat("yyyy-MM-dd-hh-mm-ss");
  const params = {
    Bucket: process.env.S3_BUCKET as string,
    Key: `${path}/${date}.sql`,
    Body: buffer,
  };
  const data = await s3.putObject(params);
  return data;
};
