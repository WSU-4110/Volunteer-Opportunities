import react from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getImage } from "@/database/sthree";
import { cn } from "@/lib/utils";

export default function Viewer(props: any) {
  return (
    <div className="w-1/2 m-auto mt-20 bg-white p-8 rounded-lg shadow-md">
      <header className="text-2xl text-center font-bold">Volunteer Page</header>

      <div className="w-full m-auto mt-10">
        <img
          src={props.values?.picture}
          alt="User Profile Picture"
          className="m-auto rounded-xl"
          width="400px"
          height="400px"
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
              <p className={cn("flex min-h-[80px] ")} id="bio">
                {props.values.bio}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      {props.values.organizations.length > 0 ? (
        <div>
          <Label htmlFor="organizations">Organizations</Label>
          <table>
            <tbody>
              {props.values.organizations.map((org: any) => {
                return (
                  <tr key={org.id}>
                    <td className="p-6">
                      <img
                        src={org.image.storageId}
                        alt="Organization Profile Picture"
                        className="m-auto rounded-xl w-[70px] h-auto"
                      />
                    </td>

                    <td className="p-6">{org.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
      <br />
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
