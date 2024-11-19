import { pusherServer } from "@/lib/pusher";
import { database } from "@/database";
import { auth as authCheck } from "@/auth";
import { conversationsToUsers } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const { socketId, channelName } = req.json() as any;

  console.log(channelName);

  if (!socketId || !channelName) {
    return new Response("Missing socket Id or channel name", { status: 400 });
  }

  const userInfo = await authCheck();

  const user_id = userInfo?.user.id || "";

  // const userAllowed = await database.query.conversationsToUsers.findFirst({
  //   where: and(
  //     eq(conversationsToUsers.userId, user_id),
  //     eq(conversationsToUsers.conversationId, channelName)
  //   ),
  // });

  // console.log(userAllowed);

  // if (!userAllowed) {
  //   return new Response(
  //     "You are not a part of this conversation. Please login as the right user to subscribe to this socket.",
  //     { status: 401 }
  //   );
  // }

  const presenceData = {
    user_id: user_id,
  };

  const auth = pusherServer.authorizeChannel(
    socketId,
    channelName,
    presenceData
  );

  return new Response(JSON.stringify(auth));
}
