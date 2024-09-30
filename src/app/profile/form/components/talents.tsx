"use client";
import React from "react";
import { addUserSkill } from "@/app/profile/form/actions";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Talent from "./talent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { z } from "zod";

const formSchema = z.object({
  skillId: z.string(),
  skillName: z.string(),
});

type input = {
  addSkill: any;
  removeSkill: any;
  skillsUserHas: Skills;
  skillsUserDoesntHave: Skills;
};
type Skills = {
  skillId: string;
  skillName: string;
}[];

export default function Talents(props: input) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillId: "0",
      skillName: "0",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedSkill = props.skillsUserDoesntHave.find(
      (skill) => skill.skillId === values.skillId
    );
    props.addSkill([
      { skillId: values.skillId, skillName: selectedSkill?.skillName },
    ]);
  }
  return (
    <>
      <div className="flex flex-row items-center gap-4 w-full">
        {props.skillsUserHas.map((skill) => (
          <div key={skill.skillId}>
            <Talent
              skillName={skill.skillName}
              skillId={skill.skillId}
              removeSkill={props.removeSkill}
            />
          </div>
        ))}
      </div>
      <br />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="skillId"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="skillId" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {props.skillsUserDoesntHave.map(
                      (skill: { skillId: string; skillName: string }) => (
                        <SelectItem
                          value={skill.skillId}
                          key={skill.skillId}
                          id={skill.skillId}
                        >
                          {skill.skillName}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>Add another skill</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add</Button>
        </form>
      </Form>
    </>
  );
}
