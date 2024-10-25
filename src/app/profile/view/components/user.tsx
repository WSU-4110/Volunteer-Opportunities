"use client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  addUserSkill,
  deleteUserSkill,
  updateUser,
} from "@/app/profile/view/actions";
import { useState } from "react";
import Talents from "./talents";
import Viewer from "./viewer";
import Organization from "./organization";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { revalidatePathAction } from "@/app/profile/view/actions";
import { FileUpload } from "./fileUpload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useUserStatusStore } from "@/stores/userStatusStore";
import AddAnOrganization from "./addOrganization";
//From https://ui.shadcn.com/docs/components/form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string().min(1).max(50),
  picture: z.string(),
  bio: z.string(),
});

type InputValues = {
  name: string;
  picture: string;
  bio: string;
  customImage: any;
  skills: {
    skillId: string;
    skillName: string;
  }[];
  userS: {
    skillId: string;
    skillName: string;
    url: string;
  }[];
  organizations: {
    id: string;
    name: string;
    image: any;
  }[];

  listings: any;
};
type skills = {
  skillId: string;
  skillName: string;
}[];
const EditUserPage = ({ ...props }: any) => {
  //From https://ui.shadcn.com/docs/components/form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      picture: props.values.picture,
      username: props.values.name,
      bio: props.values.bio,
    },
  });

  const [skillsList, editSkillsList] = useState<skills>([]);
  const [skillDeleteList, editSkillDeleteList] = useState<skills>([]);
  const [skillsUserDoesntHave, setSkillsUserDoesntHave] = useState<skills>(
    props.skills
  );
  const [skillsUserHas, setSkillsUserHas] = useState<skills>(props.userS);

  function addSkill(props: skills) {
    console.log(props);
    editSkillsList((prevState) => [...prevState, ...props]);
    editSkillDeleteList((prevState) =>
      prevState.filter((skill) => skill.skillId != props[0].skillId)
    );
    setSkillsUserDoesntHave((prevState) =>
      prevState.filter((skill) => skill.skillId != props[0].skillId)
    );
    setSkillsUserHas((prevState) => [...prevState, ...props]);
  }

  function removeSkill(props: skills) {
    editSkillDeleteList((prevState) => [...prevState, ...props]);
    editSkillsList((prevState) =>
      prevState.filter((skill) => skill.skillId != props[0].skillId)
    );
    setSkillsUserHas((prevState) => {
      return prevState.filter((skill) => skill.skillId != props[0].skillId);
    });
    setSkillsUserDoesntHave((prevState) => [...prevState, ...props]);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (skillsList.length > 0) {
      await addUserSkill({
        skill: skillsList.map((skill) => skill.skillId),
      });
    }
    if (skillDeleteList.length > 0) {
      await deleteUserSkill({
        skill: skillDeleteList.map((skill) => skill.skillId),
      });
    }
    console.log("submit");
    try {
      const data: File = await files[0];

      //console.log("Submit");
      //console.log(data);
      const form: FormData = new FormData();
      form.append("data", data);

      const input = {
        picture: values.picture,
        username: values.username,
        bio: values.bio,
        data: form,
        image: props.values.customImage,
      };
      //console.log(input);
      //console.log(await updateUser(input));

      revalidatePathAction();
      props.addOrganization(false);
    } catch (error) {}

    revalidatePathAction();
    props.setEditProfile(false);
  }

  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    //console.log(files);
  };

  // Form layout from https://ui.shadcn.com/docs/components/form
  //console.log(props.values.picture);
  return (
    <div className="w-1/2 m-auto mt-20">
      <header className="text-2xl text-center font-bold">Volunteer Form</header>

      <div className="w-full m-auto mt-10">
        <img
          src={props.values.picture}
          alt="User Profile Picture"
          className="m-auto rounded-xl"
        />
      </div>

      <br />
      <div id="skills">
        <Talents
          addSkill={addSkill}
          removeSkill={removeSkill}
          skillsUserHas={skillsUserHas}
          skillsUserDoesntHave={skillsUserDoesntHave}
        />
      </div>
      <br />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FileUpload onChange={handleFileUpload} />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormDescription>Change your displayed name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="bio"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter Your Bio</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <table>
            <tbody>
              <tr>
                <td>
                  <Button type="submit">Submit</Button>
                </td>
                <td>
                  <Button
                    onClick={() => {
                      props.setEditProfile(false);
                    }}
                    type="button"
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </Form>
    </div>
  );
};

export default function UserPage(props: InputValues) {
  const [editProfile, setEditProfile] = useState(false);
  const [addOrg, setAddOrg] = useState(false);
  const userStatus = useUserStatusStore((state) => state);

  function addOrganization(value: boolean) {
    setAddOrg(value);
  }
  //console.log(userStatus);
  if (!addOrg) {
    return (
      <>
        {!userStatus.userStatus || props.organizations!.length == 0 ? (
          <>
            {editProfile ? (
              <EditUserPage
                editProfile={editProfile}
                setEditProfile={setEditProfile}
                values={props}
                skills={props.skills}
                userS={props.userS}
              />
            ) : (
              <Viewer
                values={props}
                setEditProfile={setEditProfile}
                addOrganization={addOrganization}
              />
            )}
          </>
        ) : (
          <>
            <div>
              <Organization
                organizations={props.organizations}
                listings={props.listings}
                editProfile={editProfile}
                setEditProfile={setEditProfile}
              />
            </div>
          </>
        )}
      </>
    );
  } else {
    return (
      <div>
        <AddAnOrganization addOrganization={addOrganization} />
      </div>
    );
  }
}
