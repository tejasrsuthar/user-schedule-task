import { StatusCodes } from "http-status-codes";
import { logger } from "./logger";

export const httpErrors = {
  StatusCodes,
};

export const getCurrentDateParts = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return { year, month, day };
};

export const getCreateScheduleBucketDetails = () => {
  try {
    const bucketName = process.env.SCHEDULE_BUCKET_NAME as string;
    const { year, month, day } = getCurrentDateParts();
    const bucketKey = `createSchedule/${year}/${month}/${day}/log-${Date.now()}.json`;

    return { bucketName, bucketKey };
  } catch (error) {
    logger.error("getCreateScheduleBucketDetails:", error);
    throw error;
  }
};
