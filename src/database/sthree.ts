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
import { randomUUID } from "crypto";
import { detectContentType } from "next/dist/server/image-optimizer";

// import {sharp} from "sharp";
//
// import library to generate file names
const sharp = require("sharp");
require("dotenv").config();

const client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_ID!,
  },
});
// Used chat gpt to assist in debuging type file to pass to s3 bucket
export async function putImage(data: File) {
  try {
    // Generate key
    const key = randomUUID().toString() + ".jpg";
    const image = await data.arrayBuffer();

    //Max file size should be 1000000 bytes or 1 mb

    //console.log(image.byteLength);
    if (image.byteLength <= 1000000) {
      const image2 = await sharp(image)
        .jpeg({ quality: 90, mozijpeg: true })
        .toBuffer();

      await put({
        bucketName: process.env.BUCKET,
        key: key,
        data: image2,
      });
      //console.log(key);
      return key;
    } else {
      return "";
    }
  } catch (caught) {
    //console.log(caught);
    // Any error should cause no file to be uploaded to the bucket
    return "";
  }
}
// Reupload picture resusing key
export async function rePutImage(data: File, key: string) {
  try {
    const image = await data.arrayBuffer();
    // Image should be less than 1mb in size

    //console.log(key);
    if (image.byteLength <= 1000000) {
      const image2 = await sharp(image)
        .jpeg({ quality: 90, mozijpeg: true })
        .toBuffer();

      await put({
        bucketName: process.env.BUCKET,
        key: key,
        data: image2,
      });
    }
  } catch (caught) {
    //console.log(caught);
    //Errors should still result in a valid image stored at the key
  }
  return key;
}
//From aws docs, some non functional changes have been made
const put = async ({ bucketName, key, data }: any) => {
  //const metadata = await sharp(data).metadata();
  // From chatgpt aws s3 PutObjectCommand() inputing params made some changes

  // May want errors thrown to the calling function will test

  const params = {
    ACL: <any>"public-read",
    Bucket: bucketName,
    Key: key,
    Body: data,
  };
  const command = new PutObjectCommand(params);

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

export async function getImage(key: string) {
  // Keys should only be generated from the above put method making them very long
  // Do not put keys in the database without putting them in the bucket it may break the page that calls this.

  return (
    "https://" +
    process.env.BUCKET +
    ".s3." +
    process.env.REGION +
    ".amazonaws.com/" +
    key
  );
  //try {
  //  return createPresignedUrlGet({ bucket: process.env.BUCKET, key: key });
  //} catch (caught) {
  //  return "";
  //}
}

// From aws docs https://docs.aws.amazon.com/AmazonS3/latest/API/s3_example_s3_Scenario_PresignedUrl_section.html
const createPresignedUrlGet = ({ bucket, key }: any) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 600 });
};
