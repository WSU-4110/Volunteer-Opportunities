"use server";

import https from "https";
import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  S3ServiceException,
  waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomBytes } from "crypto";

// import {sharp} from "sharp";
//
// import library to generate file names

require("dotenv").config();

const client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_ID!,
  },
});

export async function putImage(data: any) {
  // Generate key
  const key = randomBytes(32).toString();

  //const url = createPresignedUrlPut({ bucket: process.env.BUCKET, key: key });
  //console.log(url);
  await put({
    bucketName: process.env.BUCKET,
    key: key,
    data: data,
  });

  return key;
}

const put = async ({ bucketName, key, data }: any) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: data,
  });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === "EntityTooLarge"
    ) {
      console.error(
        `Error from S3 while uploading object to ${bucketName}. \
The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
or the multipart upload API (5TB max).`
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while uploading object to ${bucketName}.  ${caught.name}: ${caught.message} ${caught.cause}`
      );
    } else {
      throw caught;
    }
  }
};

//export async function getImage(key: string) {
//  return createPresignedUrlGet({ bucket: process.env.BUCKET, key: key });
//}

export async function deleteImage(key: string) {}

//From aws docs https://docs.aws.amazon.com/AmazonS3/latest/API/s3_example_s3_Scenario_PresignedUrl_section.html
const createPresignedUrlPut = ({ bucket, key }: any) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 600 });
};

//From aws docs https://docs.aws.amazon.com/AmazonS3/latest/API/s3_example_s3_Scenario_PresignedUrl_section.html
/*function put(url: any, data: any) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      { method: "PUT", headers: { "Content-Length": new Blob([data]).size } },
      (res) => {
        let responseBody = "";
        res.on("data", (chunk) => {
          responseBody += chunk;
        });
        res.on("end", () => {
          resolve(responseBody);
        });
      }
    );
    req.on("error", (err) => {
      reject(err);
    });
    req.write(data);
    req.end();
  });
}
  */
// From aws docs https://docs.aws.amazon.com/AmazonS3/latest/API/s3_example_s3_Scenario_PresignedUrl_section.html
//const createPresignedUrlGet = ({ bucket, key }: any) => {

//  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
//  return getSignedUrl(client, command, { expiresIn: 600 });
//};
