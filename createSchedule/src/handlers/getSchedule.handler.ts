import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

import { BadRequestError } from "../errors/badRequest.error";
import { Schedule } from "../models/schedule";
import { get } from "lodash";
import { httpErrors } from "../utils/common";
import { logger } from "../utils/logger";

export const getScheduleHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  try {
    logger.info("getScheduleHandler:event:", event);
    const userId = get(event.pathParameters, "userId");

    const userScheduleResult = await Schedule.findOne({
      where: { userId: parseInt(userId, 10) },
    });

    if (!userScheduleResult) {
      throw new BadRequestError(`No schedule found for user: ${userId}`);
    }

    const userSchedule = userScheduleResult.toJSON();

    return {
      statusCode: httpErrors.StatusCodes.OK,
      body: JSON.stringify({
        userSchedule,
      }),
    };
  } catch (error) {
    logger.error("getScheduleHandler:error", error);
    throw error;
  }
};
