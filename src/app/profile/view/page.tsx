import UserPage from "./(components)/user";
import React from "react";
import {
  userData,
  getSkills,
  userSkills,
  getOrganizations,
  getListings,
} from "./actions";

import { getImage } from "@/database/sthree";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type organizationId = {
  orgID: string;
};
// Add to change image from type unknown to any to access storageId.
// Can be removed if organizations arry is changed to type any
// Do not want to do this while working on page because it removes
// type saftey.

export default async function EditProfile() {
  const skills = await getSkills();
  const userD: any = await userData();
  const userSkill = await userSkills();

  const organizations: any = await getOrganizations();

  const authStatus = await auth();

  if (!authStatus?.user) {
    redirect("/login");
  }

  if (
    skills &&
    userD &&
    userSkill &&
    organizations &&
    skills[0] &&
    userD[0] &&
    userSkill[0] &&
    organizations[0] &&
    userD[0][0]
  ) {
    let picture = userD[0][0].image || "";

    // Added type any to allow access tp the inside of json data
    const listings: any = [];
    try {
      for (let i = 0; i < organizations[0]!.length; i++) {
        let id: organizationId = { orgID: organizations[0]![i].id };
        let [listing, error] = await getListings(id);
        listings[i] = listing;
      }
    } catch {}
    return (
      <div className="bg-slate-200 ">
        <div className="pt-1 pb-20">
          {userD[0]![0].userImage ? (
            <UserPage
              customImage={userD[0]![0].userImage.id}
              name={userD[0]![0].name}
              picture={picture}
              bio={userD[0]![0].bio}
              skills={skills[0]!}
              userS={userSkill[0]!}
              organizations={organizations[0]!}
              listings={listings}
            ></UserPage>
          ) : (
            <UserPage
              customImage={null}
              name={userD[0]![0].name}
              picture={picture}
              bio={userD[0]![0].bio}
              skills={skills[0]!}
              userS={userSkill[0]!}
              organizations={organizations[0]!}
              listings={listings}
            ></UserPage>
          )}
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
