import react from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getImage } from "@/database/sthree";
import { cn } from "@/lib/utils";

export default function Viewer(props: any) {
  return (
    <div className="w-1/2 m-auto mt-20">
      <header className="text-2xl text-center font-bold">Volunteer Page</header>

      <div className="w-full m-auto mt-10">
        <img
          src={props.values?.picture}
          alt="User Profile Picture"
          className="m-auto rounded-xl"
          width="400px"
          height="400px"
        />
      </div>
      <br />
      <Label htmlFor="skills">Your Skills</Label>
      <div id="skills">
        <table>
          <tbody>
            <tr>
              {props.values.userS.map(
                (skill: { skillId: string; skillName: string }) => (
                  <td key={skill.skillName}>
                    <Badge>{skill.skillName}</Badge>
                  </td>
                )
              )}
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <Label htmlFor="name">Username:</Label>
      <h1 id="name">{props.values.name}</h1>
      <br />
      <Label htmlFor="bio">User Bio:</Label>
      <p className={cn("flex min-h-[80px] ")} id="bio">
        {props.values.bio}
      </p>

      <Label htmlFor="organizations">Organizations</Label>
      <table>
        <tbody>
          {props.values.organizations.map((org: any) => {
            return (
              <tr key={org.id}>
                <td>
                  <img
                    src={org.image.storageId}
                    alt="Organization Profile Picture"
                    className="m-auto rounded-xl"
                    width={"70px"}
                    height={"70px"}
                  />
                </td>

                <td>{org.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <Button
        onClick={() => {
          props.addOrganization(true);
        }}
        type="button"
      >
        Add Organizaiton
      </Button>
      <br />
      <br />
      <br />
      <Button
        onClick={() => {
          props.setEditProfile(true);
        }}
        type="button"
      >
        Edit
      </Button>
    </div>
  );
}
