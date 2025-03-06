import postgres from "postgres";

export const sql = postgres({
  user: "postgres",
  password: "postgres",
  database: "bodegacats",
});
