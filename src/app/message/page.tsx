import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MessagesClient from "./messagesClient";
import {
  getOtherOrganizationsAction,
  getUserOrganizations,
  getCurrentUser,
} from "./actions";
import { getImage } from "@/database/sthree";

const MessagesPage = async () => {
  const authStatus = await auth();
  const [otherOrganizations, otherOrgerror] =
    await getOtherOrganizationsAction();
  const [userOrganizations, userOrgerror] = await getUserOrganizations();
  const [user, userError] = await getCurrentUser();
  if (!authStatus?.user) {
    redirect("/api/auth/signin");
  }

  if (user) {
    if (user[0].customFile) {
      const image = authStatus.user.image;
      try {
        const userImage: any = user[0].userImage;

        //Commented out for testing this does work
        //authStatus.user.image = await getImage(userImage.id);
      } catch (err) {
        authStatus.user.image = image;
      }
    }
  }
  console.log(authStatus.user.image);
  return (
    <MessagesClient
      authStatus={authStatus}
      otherOrganizations={otherOrganizations || []}
      userOrganizations={userOrganizations || []}
    />
  );
};

export default MessagesPage;
