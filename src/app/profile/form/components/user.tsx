"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  addUserSkill,
  deleteUserSkill,
  updateUser,
  userSkills,
} from "@/app/profile/form/actions";
import { useEffect, useState } from "react";
import Talents from "./talents";
import Viewer from "./viewer";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  skills: {
    skillId: string;
    skillName: string;
  }[];
  userS: {
    skillId: string;
    skillName: string;
    url: string;
  }[];
};

type FormValues = {
  name: string;
  picture: string;
  bio: string;
};

type userInput = {
  picture: string;
  username: string;
  bio: string;
};

type skills = {
  skillId: string;
  skillName: string;
}[];

type skill = {
  skill: string;
};

type UserSkill = {
  skillId: string;
  skillName: string;
};

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

  const [skillsList, editSkillsList] = useState<skills>();
  const [skillDeleteList, editSkillDeleteList] = useState<skills>();

  function addSkill(props: skills) {
    if (skillDeleteList == undefined) {
      if (skillsList == undefined) {
        editSkillsList(props);
      } else {
        editSkillsList(skillsList.concat(props));
      }
    } else {
      let found: boolean = false;
      for (let i = 0; i < skillDeleteList.length; i++) {
        if (skillDeleteList[i].skillId == props[0].skillId) {
          found = true;

          editSkillDeleteList(skillDeleteList.toSpliced(i, 1));
        }
      }
      if (!found) {
        if (skillsList == undefined) {
          editSkillsList(props);
        } else {
          editSkillsList(skillsList.concat(props));
        }
      }
    }
  }

  function removeSkill(props: skills) {
    if (skillsList == undefined) {
      if (skillDeleteList == undefined) {
        editSkillDeleteList(props);
      } else {
        editSkillDeleteList(skillDeleteList.concat(props));
      }
    } else {
      let found: boolean = false;
      for (let i = 0; i < skillsList.length; i++) {
        if (skillsList[i].skillId == props[0].skillId) {
          found = true;

          editSkillsList(skillsList.toSpliced(i, 1));
        }
      }
      if (!found) {
        if (skillDeleteList == undefined) {
          editSkillDeleteList(props);
        } else {
          editSkillDeleteList(skillDeleteList.concat(props));
        }
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const input: userInput = {
      picture: values.picture,
      username: values.username,
      bio: values.bio,
    };

    if (skillsList != undefined) {
      for (let i = 0; i < skillsList.length; i++) {
        let skillID: skill = { skill: skillsList[i].skillId };
        await addUserSkill(skillID);
      }
    }

    if (skillDeleteList != undefined) {
      for (let i = 0; i < skillDeleteList.length; i++) {
        let skillID: skill = { skill: skillDeleteList[i].skillId };
        await deleteUserSkill(skillID);
      }
    }
    await updateUser(input);

    props.setEditProfile(false);
    let newValues = props.values;
    //For user skills remove skills from the remove list and add the skills from the add list
    if (skillDeleteList != undefined) {
      for (let i = 0; i < skillDeleteList.length; i++) {
        for (let j = 0; j < newValues.userS.length; j++)
          if (skillDeleteList[i].skillId == newValues.userS[j].skillId) {
            newValues.userS = newValues.userS.toSpliced(j, 1);
          }
      }
    }
    if (skillsList != undefined) {
      for (let i = 0; i < skillsList.length; i++) {
        for (let j = 0; j < newValues.skills.length; j++)
          if (skillsList[i].skillId == newValues.skills[j].skillId) {
            newValues.skills = newValues.skills.toSpliced(j, 1);
          }
      }
    }
    newValues.name = values.username;
    newValues.bio = values.bio;
    newValues.picture = values.picture;

    props.setValues(newValues);
    editSkillsList(undefined);
    editSkillDeleteList(undefined);
  }

  // Form layout from https://ui.shadcn.com/docs/components/form

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

      <div id="skills">
        <Talents
          skill={props.values.skills}
          userS={props.values.userS}
          addSkill={addSkill}
          removeSkill={removeSkill}
        />
      </div>
      <br />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="picture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Picture</FormLabel>
                <FormControl>
                  <Input placeholder="picture" {...field} />
                </FormControl>
                <FormDescription>
                  Temporary will be changed later
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default function UserPage(props: InputValues) {
  const [editProfile, setEditProfile] = useState(true);
  const [values, setValues] = useState<InputValues>(props);

  return (
    <>
      {editProfile ? (
        <EditUserPage
          editProfile={editProfile}
          setEditProfile={setEditProfile}
          values={values}
          setValues={setValues}
        />
      ) : (
        <Viewer values={values} setEditProfile={setEditProfile} />
      )}
    </>
  );
}
