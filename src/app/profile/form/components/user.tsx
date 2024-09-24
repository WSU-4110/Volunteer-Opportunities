"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { updateUser, userSkills } from "@/app/profile/form/actions";
import { useEffect, useState } from "react";
import Talents from "./talents";

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

const EditUserPage = ({ ...props }: any) => {
  //From https://ui.shadcn.com/docs/components/form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      picture: props?.picture,
      username: props?.name,
      bio: props?.bio,
    },
  });

  const [skillsList, editSkillsList] = useState();
  const [skillDeleteList, editSkillDeleteList] = useState();

  function addSkill(props: any) {
    editSkillDeleteList(props);
    editSkillsList(props);
  }

  function removeSkill(props: any) {
    editSkillsList(props);
    editSkillDeleteList(props);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const input: userInput = {
      picture: values.picture,
      username: values.username,
      bio: values.bio,
    };
    console.log(values);
    await updateUser(input);
    //Add for loops to add and delete skills
    props.setEditProfile(false);
  }
  // Form layout from https://ui.shadcn.com/docs/components/form
  return (
    <div className="w-1/2 m-auto mt-20">
      <header className="text-2xl text-center font-bold">Volunteer Form</header>

      <div className="w-full m-auto mt-10">
        <img
          src={props?.picture}
          alt="User Profile Picture"
          className="m-auto rounded-xl"
        />
      </div>
      <Talents skill={props.skills} userS={props.userS} />
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

  return (
    <>
      {editProfile ? (
        <EditUserPage
          editProfile={editProfile}
          setEditProfile={setEditProfile}
          {...props}
        />
      ) : null}
    </>
  );
}
