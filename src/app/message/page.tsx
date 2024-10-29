import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MessagesClient from "./messagesClient";
import { getOtherOrganizationsAction, getUserOrganizations } from "./actions";

const MessagesPage = async () => {
  const authStatus = await auth();
  const [otherOrganizations, otherOrgerror] =
    await getOtherOrganizationsAction();
  const [userOrganizations, userOrgerror] = await getUserOrganizations();

  if (!authStatus?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <MessagesClient
      authStatus={authStatus}
      otherOrganizations={otherOrganizations || []}
      userOrganizations={userOrganizations || []}
    />
  );
};

export default MessagesPage;
