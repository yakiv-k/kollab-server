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
    connection: process.env.JAWSDB_URL,
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

// module.exports = {
//   development: {
//     client: "mysql",
//     connection: {
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: "kollab",
//       charset: "utf8",
//     },
//   },
//   production: {
//     client: "mysql",
//     connection: process.env.JAWSDB_URL,
//     migrations: {
//       directory: "./migrations",
//     },
//     seeds: {
//       directory: "./seeds",
//     },
//     useNullAsDefault: true
//   },
// };
