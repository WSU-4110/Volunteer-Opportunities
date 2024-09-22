import React from "react";
import { userSkills } from "@/app/profile/actions";
import { useForm, SubmitHandler } from "react-hook-form";

type Input = {
  id: string;
  skills: {
    field1: string;
    field2: string;
  }[];
};

export default async function Talents(props: Input) {
  const userData = userSkills(props.id);
  let skills = props.skills;

  return (
    <div>
      <label htmlFor="skills">Add A Skill </label>
      <select name="skills" id="skills">
        {skills.map((skill: { field1: string; field2: string }) => (
          <option value={skill.field1} key={skill.field1}>
            {skill.field2}
          </option>
        ))}
      </select>
      <br />
      <button type="submit">Add</button>
    </div>
  );
}
