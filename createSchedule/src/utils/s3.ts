import { logger } from "./logger";

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: process.env.REGION });

/**
 * Logs a mutation action to S3 with partitioned year/month/day structure.
 *
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {object} data - The data to be logged.
 */
export const mutationLog = async <T>(
  bucketName: string,
  bucketKey: string,
  data: T
) => {
  const body = JSON.stringify(data);

  try {
    // Upload the object to S3
    const uploadParams = {
      Bucket: bucketName,
      Key: bucketKey,
      Body: body,
      ContentType: "application/json",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    logger.info(`Successfully uploaded data to ${bucketName}/${bucketKey}`);
  } catch (err) {
    logger.error("Error uploading mutationLog:", err);
  }
};
