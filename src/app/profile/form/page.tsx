import UserPage from "./components/user";
import React from "react";
import {
  userData,
  getSkills,
  userSkills,
  getOrganizations,
  getListings,
} from "./actions";

import { useState, useEffect } from "react";

type organizationId = {
  orgID: string;
};

export default async function EditProfile() {
  console.log(await getSkills());
  const skills = await getSkills();
  const userD = await userData();
  const userSkill = await userSkills();

  const organizations = await getOrganizations();

  if (
    skills != null &&
    userD != null &&
    userSkill != null &&
    organizations != null
  ) {
    const picture = userD[0]![0].image || "";
    const listings = [];
    if (organizations[0]! != null && organizations[0]! != undefined)
      for (let i = 0; i < organizations[0]!.length; i++) {
        let id: organizationId = { orgID: organizations[0]![i].id };
        listings[i] = await getListings(id);
      }
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
          organizations={organizations[0]!}
          listings={listings}
        ></UserPage>
      </div>
    );
  } else {
    return <div></div>;
  }
}
