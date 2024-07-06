import { APIGatewayProxyHandler } from "aws-lambda";
import { updateScheduleHandler } from "../handlers/updateSchedule.handler";

type RouteDefinition = {
  path: string;
  method: string;
  handler: APIGatewayProxyHandler;
};

export const routes: RouteDefinition[] = [
  {
    path: "/schedule/:userId",
    method: "PATCH",
    handler: updateScheduleHandler,
  },
];
