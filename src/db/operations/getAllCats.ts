import "server-only";
import { db } from "../db";

export async function getAllCats() {
  const data = await db.query(`select * from cats;`);
  return data.rows;
}
