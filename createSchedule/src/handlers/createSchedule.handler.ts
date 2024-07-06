import {
  CreateSchedule,
  createScheduleSchema,
} from "../schema/create-schedule.schema";
import { getCreateScheduleBucketDetails, httpErrors } from "../utils/common";

import { APIGatewayProxyHandler } from "aws-lambda";
import { BadRequestError } from "../errors/badRequest.error";
import { Schedule } from "../models/schedule";
import { logger } from "../utils/logger";
import { mutationLog } from "../utils/s3";
import { validateSchedule } from "../utils/validateSchedule";
import { validateSchema } from "../utils/validateSchema";

async function createSchedule(scheduleData: CreateSchedule) {
  try {
    const newSchedule = await Schedule.create(scheduleData);

    logger.info("New Schedule created:", newSchedule.toJSON());
    return newSchedule;
  } catch (error) {
    console.error("Error creating Schedule:", error);
    throw error;
  }
}

export const createScheduleHandler: APIGatewayProxyHandler = async (event) => {
  try {
    logger.info("incoming request:", event);
    let request;

    try {
      request = JSON.parse(event.body as string);
    } catch (error) {
      throw new BadRequestError("Invalid Request Body");
    }

    // validation gates
    await validateSchema(request, createScheduleSchema).catch((err) => {
      throw new BadRequestError(err.errors);
    });

    // schedule validation
    logger.info("Validation request schedule");
    validateSchedule(request.schedule);
    logger.info("Schedule request validated");

    // insert user schedule
    logger.info("Inserting schedule entry");
    const newSchedule = await createSchedule(request);
    logger.info("Schedule entry inserted");

    // insert mutation log
    const { bucketName, bucketKey } = getCreateScheduleBucketDetails();
    logger.info(`Inserting mutation log to ${bucketName}/${bucketKey}`);
    await mutationLog(bucketName, bucketKey, newSchedule);
    logger.info(`Inserting mutation log success`);

    return {
      statusCode: httpErrors.StatusCodes.OK,
      body: JSON.stringify({
        message: `User Schedule added successfully`,
      }),
    };
  } catch (error) {
    throw error;
  }
};
