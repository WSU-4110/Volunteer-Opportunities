"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { deleteUserSkill } from "../actions";
import { evalManifestWithRetries } from "next/dist/server/load-components";

type skill = {
  skillId: string;
  id: string;
};

type Input = {
  userId: string;
  skillId: string;
  skillName: string;
};
export default function Talent(props: Input) {

  const { register, handleSubmit } = useForm<skill>({
    defaultValues: {
      id: props?.userId,
      skillId: props?.skillId,
    },
  });
  
  const onSubmit: SubmitHandler<skill> = async (data) => {
    console.log(data);
    await deleteUserSkill(data.skillId);
  };

  console.log(props);
  if(props.skillName != null){
  return (
    <div>
      <form className="skill" onSubmit={handleSubmit(onSubmit)}>
        <h1>{props.skillName}</h1>
        <button>X</button>
      </form>
    </div>
  );
}
else{
  return <div></div>
}
}
