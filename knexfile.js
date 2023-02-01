require("dotenv").config();


const connections = {
  development: {
    client: "mysql",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "kollab",
    },
  },
  production: {
    client: "mysql",
    connection: 'mysql://root:M0JYKWF8O8ZwLEa3FgrT@containers-us-west-98.railway.app:7651/railway',
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
