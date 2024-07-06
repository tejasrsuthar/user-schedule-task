import { validateSchedule, validateTimezone } from "../utils/validateSchedule";

import { APIGatewayProxyHandler } from "aws-lambda";
import { BadRequestError } from "../errors/badRequest.error";
import { CreateSchedule } from "../schema/create-schedule.schema";
import { Schedule } from "../models/schedule";
import { logger } from "../utils/logger";

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

export const createScheduleHandler: APIGatewayProxyHandler = async (
  event,
  context
) => {
  try {
    logger.info("incoming request:", event);
    let request;

    try {
      request = JSON.parse(event.body);
    } catch (error) {
      throw new BadRequestError("Invalid Request Body");
    }

    // schedule validation
    validateSchedule(request.schedule);
    validateTimezone(request.timezone);

    // insert user schedule
    await createSchedule(request);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User Schedule added successfully`,
      }),
    };
  } catch (error) {
    throw error;
  }
};
