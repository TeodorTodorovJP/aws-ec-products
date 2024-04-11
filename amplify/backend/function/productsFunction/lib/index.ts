import awsServerlessExpress from "aws-serverless-express";
import app from "./app.js";
import { type APIGatewayProxyEvent, type Context } from "aws-lambda";

const server = awsServerlessExpress.createServer(app);

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
