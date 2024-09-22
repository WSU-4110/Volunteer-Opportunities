"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { updateUser } from "@/app/profile/actions";
import Talents from "./talents";
type InputValues = {
  name: string;
  picture: string;
  bio: string;
  id: string;
  skills: any;
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
    //console.log(data);
    await updateUser(data.id, data.picture, data.name, data.bio);
  };

  console.log(props.skills.length);
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
        {props.children}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
