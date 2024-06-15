import mongoose from "mongoose";

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(URI);
  console.log("database connected");
}
