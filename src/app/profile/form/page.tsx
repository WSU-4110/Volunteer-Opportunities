
import UserPage from "./components/user";
import React from "react";
import { userData, getSkills, userSkills } from "./actions";

import Talents from "./components/talents";
import { useState, useEffect } from "react";

type uData = {
  name: string;
  image: string | null;
  bio: string;
}[];

export default async function EditProfile() {
  // Temp sould be replaced with sessioned user ID.
  // Use Auth to check for session

  //const [userD, setUser] = useState<uData>();

  //useEffect(() => {
  //  async function fetchUser() {
  //    console.log("");
  //    const users: uData = await userData("11111111-1111-1111-1111111111");
  //    console.log(users);
  //    setUser(users);
  //  }
  //  fetchUser();
  //}, [userD]);

  const skills = await getSkills();
  const userD = await userData();
  const userSkill = await userSkills()
  
  {
    // Add error handling
    // This is for testing without auth
    if (userD != undefined) {
      const picture = userD[0].image || "";
      return (
        <div>
          <header></header>
          <p></p>
          <UserPage
            name={userD[0].name}
            picture={picture}
            bio={userD[0].bio}
            id="11111111-1111-1111-1111111111"
          >
            <Talents skill = {skills} userS = {userSkill}/>
          </UserPage>
        </div>
      );
    }
  }
}
