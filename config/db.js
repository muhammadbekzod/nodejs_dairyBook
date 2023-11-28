const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "AllohuAkbar",
  database: "diarybook",
  host: "localhost",
  port: 5433,
});

module.exports = pool;
