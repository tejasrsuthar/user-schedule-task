import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

import { BadRequestError } from "../errors/badRequest.error";
import { GetScheduleResponse } from "../schema/create-schedule.schema";
import { Schedule } from "../models/schedule";
import { get } from "lodash";
import { httpErrors } from "../utils/common";
import { logger } from "../utils/logger";
import moment from "moment-timezone";

const isUserOnline = async (
  userSchedule: GetScheduleResponse,
  timestamp: number
) => {
  const { schedule, timezone } = userSchedule;

  const userTime = moment.unix(timestamp).tz(timezone);
  const day = userTime.format("dddd");
  const time = userTime.format("HH:mm");

  const periods = schedule[day] || [];

  logger.info({
    periods,
    timestamp,
    day,
    time,
    timezone,
    momentTime: moment(time, "HH:mm"),
  });

  return periods.some((period) =>
    moment(time, "HH:mm").isBetween(
      moment(period.start, "HH:mm"),
      moment(period.end, "HH:mm")
    )
  );
};

export const checkScheduleHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  try {
    logger.info("checkScheduleHandler:event:", event);
    const userId = get(event.pathParameters, "userId");
    const timestamp = get(event.queryStringParameters, "timestamp", null);

    logger.info({ userId, timestamp });

    if (!timestamp) {
      throw new BadRequestError("timestamp query param is missing");
    }

    const userScheduleResult = await Schedule.findOne({
      where: { userId: parseInt(userId, 10) },
    });

    if (!userScheduleResult) {
      throw new BadRequestError(`No schedule found for user: ${userId}`);
    }

    const userSchedule = userScheduleResult.toJSON() as GetScheduleResponse;
    const isOnline = await isUserOnline(userSchedule, parseInt(timestamp, 10));

    return {
      statusCode: httpErrors.StatusCodes.OK,
      body: JSON.stringify({
        status: isOnline ? "online" : "offline",
      }),
    };
  } catch (error) {
    logger.error("checkScheduleHandler:error", error);
    throw error;
  }
};
