import { httpErrors } from "../utils/common";

// Define a custom error class for BadRequest
export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = httpErrors.StatusCodes.BAD_REQUEST;
    Error.captureStackTrace(this, this.constructor);
  }
}
