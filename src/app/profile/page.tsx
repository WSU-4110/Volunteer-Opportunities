import UserPage from "./components/user";
import React from "react";
import { userData } from "./actions";
import { auth } from "@/auth";
import Name from "./components/name";
import UserPicture from "./components/userPicture";
import Talents from "./components/talents";
import UserBio from "./components/userBio";

export default async function EditProfile() {
  // Temp sould be replaced with sessioned user ID.

  const user = await auth();

  if (!user?.user.id && user != null) {
    const data = await userData(user.user.id || "");
    return (
      <div>
        <header>profile</header>
        <UserPage>
          {
            <div>
              <UserPicture />
              <Name name={data[0].field1} id={user.user.id} />
              <Talents />
              <UserBio />
            </div>
          }
        </UserPage>
      </div>
    );
  } else {
    // Add error handling
    // This is for testing without auth
    const data = await userData("11111111-1111-1111-1111111111");
    return (
      <div>
        <header>profile</header>
        <UserPage>
          {
            <div>
              <UserPicture />
              <Name name={data[0].field1} id="11111111-1111-1111-1111111111" />
              <Talents />
              <UserBio />
            </div>
          }
        </UserPage>
      </div>
    );
  }
}
