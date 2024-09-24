"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { deleteUserSkill } from "../actions";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

type skill = {
  skillId: string;
  skillName: string;
};
type Skills = {
  skillId: string;
  skillName: string;
}[];

type input = {
  skillName: string;
  skillId: string;
  skills: Skills;
  setSkills: React.Dispatch<React.SetStateAction<Skills>>;
};
type deleteSkill = {
  skill: string;
};
export default function Talent({ ...props }: input) {
  const [show, setShow] = useState(true);

  const { register, handleSubmit } = useForm<skill>({
    defaultValues: {
      skillId: props?.skillId,
      skillName: props?.skillName,
    },
  });

  const onSubmit: SubmitHandler<skill> = async (data) => {
    const skill: deleteSkill = { skill: data.skillId };
    await deleteUserSkill(skill);

    setShow(false);
    let newSkills = props.skills;
    newSkills.unshift(data);
    props.setSkills(newSkills);
  };

  if (show) {
    return (
      <form className="skill" onSubmit={handleSubmit(onSubmit)}>
        <Badge>
          {props.skillName}&emsp;
          <button>x</button>
        </Badge>
      </form>
    );
  } else {
    return <div></div>;
  }
}
