import { DataTypes } from "sequelize";
import { sequelize } from "../utils/database";

export const Schedule = sequelize.define(
  "Schedule",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    schedule: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
