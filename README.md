# DB Backup

This project provides a set of scripts and tools to automate the backup process of databases. It supports various database systems and allows for scheduled backups, storage management, and restoration.

## Features

- Automated database backups
- Support for multiple database systems (e.g., MySQL, PostgreSQL, MongoDB)
- Scheduled backups using cron jobs
- Backup storage management (e.g., local storage, cloud storage)
- Easy restoration process

## Requirements

- Node 22 or later
- Database client libraries (e.g., `mysql-client`, `psql`, `mongodump`)
- `cron` for scheduling backups

## Installation

```bash
pnpm install
```

## Usage

```bash
pnpm build
pnpm start
```

## Using docker

```bash
docker run --rm -it \
    -e DB_URL="postgresql://user:password@localhost:5432/database" \
    -e S3_BUCKET="my-bucket" \
    -e S3_REGION="us-east-1" \
    -e S3_ENDPOINT="https://s3.amazonaws.com" \
    -e S3_ACCESS_KEY="my-access-key" \
    -e S3_SECRET_KEY="my-secret-key" \
    -e CRON_EXECUTION_TIME="0 */12 * * *" \
    -e RUN_IMMEDIATELY="true" \
    ghcr.io/dhoniaridho/cron-db-backup:latest
```

## Configuration

The project uses environment variables to configure the backup process. The following environment variables are required:

- `DB_URL`: The connection string for the database to be backed up.
- `CRON_EXECUTION_TIME`: The cron expression that determines when the backup job will be executed. Defaults to `0 */12 * * *`.
- `S3_BUCKET`: The name of the S3 bucket where the backups will be stored.
- `S3_REGION`: The region where the S3 bucket is located.
- `S3_ENDPOINT`: The S3 endpoint URL.
- `S3_ACCESS_KEY`: The access key to use when connecting to S3.
- `S3_SECRET_KEY`: The secret key to use when connecting to S3.
- `RUN_IMMEDIATELY`: Whether to run the backup immediately or not. Defaults to `false`.

## License

This project is released under the [MIT License](LICENSE).
