import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MessagesClient from "./messagesClient";

const MessagesPage = async () => {
  const authStatus = await auth();

  if (!authStatus?.user) {
    redirect("/api/auth/signin");
  }

  return <MessagesClient authStatus={authStatus} />;
};

export default MessagesPage;
