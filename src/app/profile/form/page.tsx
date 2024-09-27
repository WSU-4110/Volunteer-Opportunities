import UserPage from "./components/user";
import React from "react";
import { userData, getSkills, userSkills } from "./actions";

import { useState, useEffect } from "react";

type skill =
  | [
      (
        | {
            skillId: string;
            skillName: string;
          }[]
        | null
      ),
      null
    ]
  | [
      null,
      {
        code: string;
        message: string;
      }
    ];

type uData =
  | [
      null,
      {
        code: string;
        message: string;
      }
    ]
  | [
      (
        | {
            name: string;
            image: string | null;
            bio: string;
          }[]
        | null
      ),
      null
    ];

type uSkills =
  | [
      (
        | {
            skillId: string;
            skillName: string;
            url: string;
          }[]
        | null
      ),
      null
    ]
  | [
      null,
      {
        code: any;
        message: string;
      }
    ];

export default async function EditProfile() {
  const skills: skill = await getSkills();
  const userD: uData = await userData();
  const userSkill: uSkills = await userSkills();

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
