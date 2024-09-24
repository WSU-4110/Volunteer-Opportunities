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
  skill: Skills;
  userS: UserSkills;
};
type Skills = {
  skillId: string;
  skillName: string;
}[];

type UserSkills = {
  skillId: string;
  skillName: string;
}[];

type skill = {
  skill: string;
};

export default function Talents(props: input) {
  const [userS, setUserS] = useState<UserSkills>(props.userS);
  const [skills, setSkills] = useState<Skills>(props.skill);
  const [render, setRender] = useState(0);
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
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const skill: skill = { skill: values.skillId };
    if (skill.skill != "0") {
      setRender(render + 1);
      await addUserSkill(skill);

      for (let i = 0; i < skills.length; i++) {
        if (skills[i].skillId == skill.skill) {
          values.skillName = skills[i].skillName;
          setSkills(skills.toSpliced(i, 1));
        }
      }

      const length = userS.push(values);
      setUserS(userS);
    }
  }
  if (userS != undefined) {
    // Issue with reusing keys on rerenders

    return (
      <div>
        <table>
          <tbody>
            <tr>
              {userS.map((skill: { skillId: string; skillName: string }) => (
                <td key={skill.skillName}>
                  <Talent
                    skillName={skill.skillName}
                    skillId={skill.skillId}
                    skills={skills}
                    setSkills={setSkills}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
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
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skills.map(
                        (skill: { skillId: string; skillName: string }) => (
                          <SelectItem
                            value={skill.skillId}
                            key={skill.skillId + render}
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
      </div>
    );
  }
}
