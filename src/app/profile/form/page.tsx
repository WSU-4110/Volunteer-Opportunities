import UserPage from "./components/user";
import React from "react";
import { userData, getSkills, userSkills } from "./actions";

export default async function EditProfile() {
  const skills = await getSkills();
  const userD = await userData();
  const userSkill = await userSkills();

  console.log(userSkill);
  console.log(skills);

  if (skills != null && userD != null && userSkill != null) {
    const picture = userD[0]![0].image || "";
    return (
      <div>
        <header></header>
        <p></p>
        <UserPage
          name={userD[0]![0].name}
          picture={picture}
          bio={userD[0]![0].bio}
          skills={skills[0]!}
          userS={userSkill[0]!}
        ></UserPage>
      </div>
    );
  } else {
    return <div></div>;
  }
}
