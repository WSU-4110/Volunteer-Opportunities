"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { updateUser, userSkills } from "@/app/profile/form/actions";
import { useEffect, useState } from "react";
import Talent from "./talent";

type InputValues = {
  name: string;
  picture: string;
  bio: string;
  id: string;
  skills: any;
  userSkills: {
    field1: string;
    field2: string;
    field3: string;
  }[];
  children: any;
};

type FormValues = {
  name: string;
  picture: string;
  bio: string;
  id: string;
};
export default function Name(props: InputValues) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      id: props?.id,
      name: props?.name,
      picture: props?.picture,
      bio: props?.bio,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await updateUser(data.id, data.picture, data.name, data.bio);
  };

  return (
    <div>
      <header>Volunteer Form</header>
      <form className="nameField" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="picture">Picture: </label>
        <input
          {...register("picture")}
          type="text"
          placeholder="picture"
          id="picture"
        ></input>
        <br />
        <label htmlFor="name">Name: </label>
        <input
          {...register("name")}
          type="text"
          placeholder="Your name"
          id="name"
        ></input>
        <br />
        <label htmlFor="bio">Bio: </label>
        <input
          {...register("bio")}
          type="text"
          placeholder="Your bio"
          id="bio"
        ></input>
        <br />

        <button type="submit">Submit</button>
      </form>
      {props.userSkills.map(
        (skill: { field1: string; field2: string; field3: string }) => (
          <Talent
            userId={props.id}
            skillName={skill.field2}
            skillId={skill.field1}
            key={skill.field2}
          />
        )
      )}
      {props.children}
    </div>
  );
}
