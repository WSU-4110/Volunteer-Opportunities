"use client";
import React from "react";
import { addUserSkill, userSkills } from "@/app/profile/form/actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

type Input = {
  id: string;
  skills: {
    field1: string;
    field2: string;
  }[];
};

type Updates = {
  id: string;
  skill: string;
};

export default function Talents(props: Input) {
  //const userData = userSkills(props.id);
  let skills = props.skills;

  const { register, handleSubmit } = useForm<Updates>({
    defaultValues: {
      id: props?.id,
      skill: "0",
    },
  });

  const onSubmit: SubmitHandler<Updates> = async (data) => {
    console.log(data);
    await addUserSkill(data.id, data.skill);
  };

  return (
    <div>
      {}
      <form name="SkillForm" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="skills">Add A Skill </label>
        <select id="skills" {...register("skill")}>
          <option value="" key="0"></option>
          {skills.map((skill: { field1: string; field2: string }) => (
            <option value={skill.field1} key={skill.field1} id={skill.field1}>
              {skill.field2}
            </option>
          ))}
        </select>
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
