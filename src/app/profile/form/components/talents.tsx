"use client";
import React from "react";
import {
  addUserSkill,
  userSkills,
  getSkills,
} from "@/app/profile/form/actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import Talent from "./talent";

type Updates = {
  id: string;
  skill: string;
};
type input = {
  skill : Skills;
  userS: UserSkills;
}
type Skills = {
  skillId: string;
  skillName: string;
}[];

type UserSkills = {
  skillId: string;
  skillName: string;
  url: string;
}[];

export default function Talents(props: input) {
  console.log("Talents");
  const skills: Skills = props.skill
  const userS: UserSkills = props.userS
  //const [skills, setSkills] = useState<Skills>();
  //const [userS, setUSkills] = useState<UserSkills>();

  //setSkills(props.skill)
  //setUSkills(props.userSkills)

  //useEffect(() => {
  //  async function fetchUser() {
  //    const skills = await getSkills("11111111-1111-1111-1111111111");
  //    const skillList = await userSkills("11111111-1111-1111-1111111111");
  //    console.log(skills);
  //    console.log(skillList);
  //    setSkills(skills);
  //    setUSkills(skillList);
  //  }

  //  fetchUser();
  //}, []);

  const { register, handleSubmit } = useForm<Updates>({
    defaultValues: {
      id: "11111111-1111-1111-1111111111",
      skill: "0",
    },
  });
  

  const onSubmit: SubmitHandler<Updates> = async (data) => {
    console.log(data);
    await addUserSkill(data.id, data.skill);
    //setSkills(await getSkills("11111111-1111-1111-1111111111"))
    //setUSkills(await userSkills("11111111-1111-1111-1111111111"))

    //refresh element
  };


  
    console.log("Render")
    return (
      <div>
        {userS.map(
          (skill: { skillId: string; skillName: string; url: string }) => (
            <Talent
              userId={"11111111-1111-1111-1111111111"}
              skillName={skill.skillName}
              skillId={skill.skillId}
              key={skill.skillName}
            />
          )
        )}
        <form name="SkillForm" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="skills">Add A Skill </label>
          <select id="skills" {...register("skill")}>
            <option value="" key="0"></option>
            {skills.map((skill: { skillId: string; skillName: string }) => (
              <option
                value={skill.skillId}
                key={skill.skillId}
                id={skill.skillId}
              >
                {skill.skillName}
              </option>
            ))}
          </select>
          <br />
          <button type="submit">Add</button>
        </form>
      </div>
    );
  }

