import fs from "fs";
import path from "path";
import { sql } from "../db";

export async function reset() {
  const initSeed = fs.readFileSync(
    path.join(__dirname, "../../seed.sql"),
    "utf8"
  );

  return sql`${initSeed}`;
}
