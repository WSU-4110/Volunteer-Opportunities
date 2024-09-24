import React from "react";
import { useState, useEffect } from "react";
import { userData, userSkills } from "./form/actions";

type uData = {
  name: string;
  image: string | null;
  bio: string;
}[];

type userSk = {
  skillId: string;
  skillName: string;
  url: string;
}[];

export default async function Profile() {
  // const [userD, setProfile] = useState<uData>();
  // const [userS, setSkills] = useState<userSk>();

  // useEffect(() => {
  //  async function fetchUser() {
  //    const users: uData = await userData("11111111-1111-1111-1111111111");
  //    const skills: userSk = await userSkills("11111111-1111-1111-1111111111");
  //    console.log(users);
  //    setProfile(users);
  //    setSkills(skills);
  // }
  // fetchUser()
  //}, [userD]);

  const userD = await userData();
  const userSk = await userSkills();

  return <div>Display User Profile Here</div>;
}
