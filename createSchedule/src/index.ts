// core imports
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

// local imports
import { CreateScheduleController } from "./controller";
import { connect } from "./utils/database";

let response;

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.info("lambda run", event);
  console.info("env", process.env.REGION);

  await connect();

  const schedular = CreateScheduleController.getInstance();

  // schedular.validateSchedule();
  // schedular.createSchedule();

  response = {
    statusCode: 200,
    body: JSON.stringify({
      message: {
        one: schedular.validateSchedule(),
        two: schedular.createSchedule(),
      },
    }),
  };

  return response;
};
