import { APIGatewayProxyHandler } from "aws-lambda";
import { checkScheduleHandler } from "../handlers/checkSchedule.handler";
import { createScheduleHandler } from "../handlers/createSchedule.handler";
import { getScheduleHandler } from "../handlers/getSchedule.handler";

type RouteDefinition = {
  path: string;
  method: string;
  handler: APIGatewayProxyHandler;
};

export const routes: RouteDefinition[] = [
  {
    path: "/schedule/:userId/check",
    method: "GET",
    handler: checkScheduleHandler,
  },
  { path: "/schedule", method: "POST", handler: createScheduleHandler },
  { path: "/schedule/:userId", method: "GET", handler: getScheduleHandler },
];
