import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

let response;

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.info("lambda run", event);
  console.info("env", process.env.REGION);

  response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "done",
    }),
  };

  return response;
};
