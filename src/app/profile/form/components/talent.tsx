"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";

type input = {
  skillName: string;
  skillId: string;
  removeSkill: any;
};

export default function Talent({ ...props }: input) {
  const onSubmit = async () => {
    props.removeSkill([{ skillId: props.skillId, skillName: props.skillName }]);
  };

  return (
    <Badge>
      {props.skillName}&emsp;
      <button onClick={onSubmit}>x</button>
    </Badge>
  );
}
