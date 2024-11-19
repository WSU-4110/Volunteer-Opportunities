import react from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getImage } from "@/database/sthree";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";

export default function Viewer(props: any) {
  return (
    <div className="w-1/2 m-auto mt-20 bg-white p-8 rounded-lg shadow-md">
      <header className="text-2xl text-center font-bold">Volunteer Page</header>

      <div className="w-full m-auto mt-10">
        <img
          src={props.values?.picture}
          alt="User Profile Picture"
          className="m-auto rounded-xl"
          width="250px"
          height="250px"
          data-testid="image"
        />
      </div>
      <br />
      <Label htmlFor="skills">Your Skills</Label>
      <div id="skills">
        <table>
          <tbody>
            <tr>
              {props.values.userS.map(
                (skill: {
                  skillId: string;
                  skillName: string;
                  url: string;
                }) => (
                  <td key={skill.skillName}>
                    <div className="hover:bg-slate-100">
                      <div className="p-2 hover:bg-slate-100 flex flex-row gap-2 items-center justify-center">
                        <img className="w-[40px] h-[40px]" src={skill.url} />
                        <h1>{skill.skillName}</h1>
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <table>
        <tbody>
          <tr>
            <td className="p-2">
              <Label htmlFor="name">Username:&nbsp;</Label>
            </td>
            <td className="p-2">
              <p id="name">&nbsp;{props.values.name}</p>
            </td>
          </tr>
          <tr>
            <td className="p-2">
              <Label htmlFor="bio">User Bio:&nbsp;</Label>
            </td>
            <td className="p-2">
              <p id="bio">{props.values.bio}</p>
            </td>
          </tr>
        </tbody>
      </table>
      {props.values.organizations.length > 0 ? (
        <div>
          <Label htmlFor="organizations">Organizations</Label>
          {props.values.organizations.map((org: any) => (
            <div key={org.id}>
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
              <br />
            </div>
          ))}
          ;
        </div>
      ) : null}

      <Button
        onClick={() => {
          props.addOrganization(true);
        }}
        type="button"
        data-testid="buttonAddOrg"
      >
        Add Organizaiton
      </Button>
      <br />
      <br />

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
  );
}
