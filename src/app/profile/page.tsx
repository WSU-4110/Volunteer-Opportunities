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
  const userD = await userData();
  const userSk = await userSkills();

  return <div>Display User Profile Here</div>;
}
