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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//From https://ui.shadcn.com/docs/components/form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  picture: z.string(),
});

const EditUserPage = ({ ...props }: any) => {
  //From https://ui.shadcn.com/docs/components/form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      picture: props.values.picture,
      name: props.values.name,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormDescription>Change your displayed name</FormDescription>
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
