export default {
  schema: "./src/models/*.js",
  out: "./src/database/migrations",
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_FILE_NAME,
  },
};