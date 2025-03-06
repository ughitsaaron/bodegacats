const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");

/** @type {import('kanel').Config} */
module.exports = {
  connection: {
    host: "localhost",
    user: "postgres",
    password: "postgres",
    database: "bodegacats",
  },

  preDeleteOutputFolder: true,
  outputPath: path.join(__dirname, "src/db/types"),
};
