import UserPage from "./components/user";
import React from "react";
import { userData, getSkills, userSkills } from "./actions";
import { auth } from "@/auth";
import Talents from "./components/talents";

export default async function EditProfile() {
  // Temp sould be replaced with sessioned user ID.

  const user = await auth();
  const skills = await getSkills("11111111-1111-1111-1111111111");
  const userSk = await userSkills("11111111-1111-1111-1111111111");
  if (!user?.user.id && user != null) {
    const data = await userData(user.user.id);

    const picture = data[0].field2 || "";
    return (
      <div>
        <header></header>
        <UserPage
          name={data[0].field1}
          picture={picture}
          bio={data[0].field3}
          id={user.user.id}
          skills={skills}
          userSkills={userSk}
        >
          {<Talents id={user.user.id} skills={skills} />}
        </UserPage>
      </div>
    );
  } else {
    // Add error handling
    // This is for testing without auth
    const data = await userData("11111111-1111-1111-1111111111");

    const picture = data[0].field2 || "";
    return (
      <div>
        <header></header>
        <p></p>
        <UserPage
          name={data[0].field1}
          picture={picture}
          bio={data[0].field3}
          id="11111111-1111-1111-1111111111"
          skills={skills}
          userSkills={userSk}
        >
          {<Talents id="11111111-1111-1111-1111111111" skills={skills} />}
        </UserPage>
      </div>
    );
  }
}
