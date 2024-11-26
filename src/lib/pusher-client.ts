"use-client";

import PusherClient from "pusher-js";

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: "/api/pusher/auth",
    authTransport: "ajax",
    auth: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  }
);

export const connectPusher = async () => {
  console.log("this ran");
  await new Promise((resolve, reject) => {
    pusherClient.connection.bind("connected", () => {
      console.log("Pusher connected successfully");
      resolve(true);
    });

    pusherClient.connection.bind("error", (err: any) => {
      console.error("Pusher connection error:", err);
      reject(err);
    });
  });
};
