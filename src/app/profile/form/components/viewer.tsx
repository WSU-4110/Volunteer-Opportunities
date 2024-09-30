import react from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export default function Viewer(props: any) {
  const onSubmit = async () => {
    props.setEditProfile(true);
  };

  return (
    <div className="w-1/2 m-auto mt-20">
      <header className="text-2xl text-center font-bold">Volunteer Page</header>

      <div className="w-full m-auto mt-10">
        <img
          src={props.values?.picture}
          alt="User Profile Picture"
          className="m-auto rounded-xl"
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
      <Label className={cn("flex h-10")} htmlFor="name">
        Username:
      </Label>
      <p id="name">{props.values.name}</p>
      <br />
      <Label htmlFor="bio">User Bio:</Label>
      <p className={cn("flex min-h-[80px] ")} id="bio">
        {props.values.bio}
      </p>
      <br />
      <Label htmlFor="organizations">Organizations</Label>
      <p id="organizations">placeholder for organizations</p>
      <br />
      <Button onClick={onSubmit} type="submit">
        edit
      </Button>
    </div>
  );
}
