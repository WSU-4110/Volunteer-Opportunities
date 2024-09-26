"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { deleteUserSkill } from "../actions";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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
  removeSkill: any;
  setUserS: React.Dispatch<React.SetStateAction<Skills>>;
  userS: Skills;
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
    //await deleteUserSkill(skill);
    let newUserSkill = props.userS;
    for (let i = 0; i < newUserSkill.length; i++) {
      if (newUserSkill[i].skillId == data.skillId) {
        newUserSkill = newUserSkill.toSpliced(i, 1);
        props.setUserS(newUserSkill);
      }
    }
    props.removeSkill([{ skillId: data.skillId, skillName: data.skillName }]);
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
    return null;
  }
}
