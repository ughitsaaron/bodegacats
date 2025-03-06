import "server-only";
import { sql } from "../db";
import Cat from "@/db/types/public/Cats";

export async function getAllCats(): Promise<Cat[]> {
  return sql`select * from cats;`;
}
