import { Sequelize } from "sequelize";
import { logger } from "./logger";

const DB_HOST = process.env.DB_HOST!;
const DB_PORT = parseInt(process.env.DB_PORT!, 10);
const DB_USER = process.env.DB_USER!;
const DB_PASSWORD = process.env.DB_PASSWORD!;
const DB_NAME = process.env.DB_NAME!;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export const connect = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info("Connection has been established successfully.");
  } catch (error) {
    logger.error("something went wrong:", error);
  }
};
