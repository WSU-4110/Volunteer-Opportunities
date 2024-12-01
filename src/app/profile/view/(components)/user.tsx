"use client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  addUserSkill,
  deleteUserSkill,
  revalidateUserViewerPage,
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
  username: z.string().min(1, "Name is required"),
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
    url: string;
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
  url: string;
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
    try {
      const data: File = await files[0];

      const form: FormData = new FormData();
      form.append("data", data);

      const input = {
        picture: values.picture,
        username: values.username,
        bio: values.bio,
        data: form,
        image: props.values.customImage,
      };
      const [updatedUser, updatedUserError] = await updateUser(input);

      if (updatedUser && updatedUser[0]) {
        revalidateUserViewerPage(updatedUser[0].id);
      }

      revalidatePathAction();
      props.addOrganization(false);
    } catch (error) {}

    revalidatePathAction();
    props.setEditProfile(false);
  }
  const [editImage, setEditImage] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  // Form layout from https://ui.shadcn.com/docs/components/form
  return (
    <div className="w-[90%] xl:w-1/2 m-auto mt-20 bg-white p-8 rounded-lg shadow-md">
      <header className="text-2xl text-center font-bold">Volunteer Form</header>
      {editImage ? (
        <div>
          <div className="h-[320px]">
            <FileUpload onChange={handleFileUpload} />
          </div>
          <Button
            onClick={() => {
              setFiles([]);
              setEditImage(false);
            }}
            type="button"
            variant="destructive"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="w-full mx-auto mt-10">
          <img
            src={props.values.picture}
            alt="User Profile Picture"
            className="m-auto rounded-xl w-[250px] h-[250px]"
          />
          <Button
            onClick={() => {
              setEditImage(true);
            }}
            type="button"
          >
            Edit
          </Button>
        </div>
      )}
      <div id="skills">
        <Talents
          addSkill={addSkill}
          removeSkill={removeSkill}
          skillsUserHas={skillsUserHas}
          skillsUserDoesntHave={skillsUserDoesntHave}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <div className="flex flex-row w-full justify-center gap-5">
            <Button type="submit">Submit</Button>
            <Button
              onClick={() => {
                props.setEditProfile(false);
              }}
              type="button"
              variant="destructive"
            >
              Cancel
            </Button>
          </div>
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
