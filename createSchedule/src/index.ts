import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

import { BadRequestError } from "./errors/badRequest.error";
import { connect } from "./utils/database";
import { httpErrors } from "./utils/common";
import { logger } from "./utils/logger";
import { match } from "path-to-regexp";
import { routes } from "./utils/routes";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context
): Promise<APIGatewayProxyResult | void> => {
  try {
    await connect();

    const { path, httpMethod } = event;

    for (const route of routes) {
      const pathMatch = match(route.path);
      if (pathMatch(path) && route.method === httpMethod) {
        return await route.handler(event, context, () => {});
      }
    }

    logger.error("Endpoint Not Found");

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Endpoint Not Found" }),
    };
  } catch (error) {
    // Handle specific errors
    if (error instanceof BadRequestError) {
      return {
        statusCode: httpErrors.StatusCodes.BAD_REQUEST,
        body: JSON.stringify({ error: error.message }),
      };
    } else {
      // Handle other errors
      console.error("Unhandled error:", error);
      return {
        statusCode: httpErrors.StatusCodes.INTERNAL_SERVER_ERROR,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  }
};
