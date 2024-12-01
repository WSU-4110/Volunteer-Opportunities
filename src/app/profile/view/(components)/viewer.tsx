import react from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getImage } from "@/database/sthree";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Viewer(props: any) {
  return (
    <div className="w-[90%] xl:w-1/2 m-auto mt-20 bg-white p-8 rounded-lg shadow-md">
      <header className="text-2xl text-center font-bold">Volunteer Page</header>

      <div className="w-full m-auto my-10">
        <img
          src={props.values?.picture}
          alt="User Profile Picture"
          className="m-auto rounded-xl w-[250px] h-[250px]"
          data-testid="image"
        />
      </div>
      <Label htmlFor="skills">Your Skills</Label>
      <div id="skills">
        <div className="flex flex-row jusifty-start items-center w-full">
          {props.values.userS.map(
            (skill: { skillId: string; skillName: string; url: string }) => (
              <div className="hover:bg-slate-100" key={skill.skillId}>
                <div className="p-2 hover:bg-slate-100 flex flex-row gap-2 items-center justify-center">
                  <img className="w-[40px] h-[40px]" src={skill.url} />
                  <h1>{skill.skillName}</h1>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 xl:grid-cols-5 gap-y-10 my-10">
        <div className="col-span-1 text-left">
          <Label htmlFor="name">Username:</Label>
        </div>
        <div className="col-span-2 xl:col-span-4 text-left">
          <p id="name">{props.values.name}</p>
        </div>
        <div className="col-span-1 text-left">
          <Label htmlFor="bio">User Bio:</Label>
        </div>
        <div className="col-span-2 xl:col-span-4 text-left">
          <p id="bio">{props.values.bio}</p>
        </div>
      </div>

      {props.values.organizations.length > 0 ? (
        <div>
          <Label htmlFor="organizations">Organizations</Label>
          <div className="flex flex-col gap-4 my-4">
            {props.values.organizations.map((org: any) => (
              <div key={org.id}>
                <Link href={`/view/organization/${org.id}`}>
                  <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-4">
                      <img
                        src={org.image.storageId || ""}
                        alt={org.name}
                        className="rounded-md object-cover w-[70px] h-[70px]"
                      />
                      <div className="flex flex-col">
                        <h3 className="font-bold text-gray-800">{org.name}</h3>
                        <p className="text-gray-600 text-sm">{org.bio}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-row justify-center items-center gap-5">
        <Button
          onClick={() => {
            props.addOrganization(true);
          }}
          type="button"
          data-testid="buttonAddOrg"
        >
          Add Organizaiton
        </Button>

        <Button
          onClick={() => {
            props.setEditProfile(true);
          }}
          type="button"
          data-testid="buttonEdit"
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
