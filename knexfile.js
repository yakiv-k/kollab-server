require("dotenv").config();

const connections = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "kollab",
    },
  },
  production: {
    client: "mysql2",
    connection: {
      host: "kollab-db.cscqquyuklfs.ca-central-1.rds.amazonaws.com",
      port: "3306",
      user: "admin",
      password: "kollabkollab",
      database: "kollabDB",
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    useNullAsDefault: true,
  },
};

module.exports =
  process.env.NODE_ENV === "production"
    ? connections.production
    : connections.development;
