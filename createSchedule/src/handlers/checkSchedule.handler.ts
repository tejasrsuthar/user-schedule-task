import { APIGatewayProxyHandler } from "aws-lambda";
import { logger } from "../utils/logger";

export const checkScheduleHandler: APIGatewayProxyHandler = async (
  event,
  context
) => {
  logger.info("checkScheduleHandler:event:", event);
  // const { userId } = event?.params || 2;

  // Your logic for schedule check using userId
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello from Schedule Check, userId:!`,
    }),
  };
};
