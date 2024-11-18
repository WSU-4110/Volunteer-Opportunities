"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type input = {
  skillName: string;
  skillId: string;
  skillUrl: string;
  removeSkill: any;
};

export default function Talent({ ...props }: input) {
  const onSubmit = async () => {
    props.removeSkill([{ skillId: props.skillId, skillName: props.skillName }]);
  };
  /*
  <Badge>
      {props.skillName}&emsp;
      <button onClick={onSubmit}>x</button>
    </Badge>
    */
  return (
    <div>
      <div className="hover:bg-slate-100">
        <div className="p-2 hover:bg-slate-100 flex flex-row gap-2 items-center justify-center">
          <img className="w-[40px] h-[40px]" src={props.skillUrl} />
          <h1>{props.skillName}</h1>
          <Button
            className="h-fit p-2 bg-white hover:bg-red-100"
            onClick={onSubmit}
            variant="outline"
            data-testid="button"
          >
            X
          </Button>
        </div>
      </div>
    </div>
  );
}
