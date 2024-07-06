import {
  UpdateSchedule,
  updateScheduleSchema,
} from "../schema/update-schedule.schema";
import { getUpdateScheduleBucketDetails, httpErrors } from "../utils/common";

import { APIGatewayProxyHandler } from "aws-lambda";
import { BadRequestError } from "../errors/badRequest.error";
import { Schedule } from "../models/schedule";
import { get } from "lodash";
import { logger } from "../utils/logger";
import { mutationLog } from "../utils/s3";
import { validateSchedule } from "../utils/validateSchedule";
import { validateSchema } from "../utils/validateSchema";

const updateSchedule = async (scheduleData: UpdateSchedule, userId: number) => {
  try {
    const updatedSchedule = await Schedule.update(scheduleData, {
      where: { userId },
      returning: true,
    });

    logger.info(`Schedule updated for User: ${userId}`, updatedSchedule);

    return updatedSchedule;
  } catch (error) {
    console.error("Error updating Schedule:", error);
    throw error;
  }
};

export const updateScheduleHandler: APIGatewayProxyHandler = async (event) => {
  try {
    logger.info("incoming request:", event);
    const userId = get(event.pathParameters, "userId");
    let request;

    try {
      request = JSON.parse(event.body as string);
    } catch (error) {
      throw new BadRequestError("Invalid Request Body");
    }

    // validation gates
    await validateSchema(request, updateScheduleSchema).catch((err) => {
      throw new BadRequestError(err.errors);
    });

    validateSchedule(request.schedule);
    logger.info("Schedule request validated");

    // insert user schedule
    logger.info("Updating schedule entry");
    const [rowsAffected, updatedSchedule] = await updateSchedule(
      request,
      parseInt(userId, 10)
    );
    logger.info("Schedule entry updated. rowsAffected:", rowsAffected);
    let opMessage;

    if (rowsAffected > 0) {
      const { bucketName, bucketKey } = getUpdateScheduleBucketDetails();
      logger.info(`Inserting mutation log to ${bucketName}/${bucketKey}`);
      await mutationLog(bucketName, bucketKey, updatedSchedule);
      logger.info(`Inserting mutation log success`);

      opMessage = "User Schedule updated successfully";
    } else {
      opMessage = "No Records updated";
    }

    return {
      statusCode: httpErrors.StatusCodes.OK,
      body: JSON.stringify({
        message: opMessage,
        updatedSchedule,
      }),
    };
  } catch (error) {
    throw error;
  }
};
