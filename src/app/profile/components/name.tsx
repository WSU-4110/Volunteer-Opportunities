"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { updateName } from "@/app/profile/actions";
type FormValues = {
  name: string;
  id: string;
};
export default function Name(props: any) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { id: props?.id },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    //console.log(data);
    await updateName(data.id, data.name);
  };

  let userName = props.name;

  return (
    <form className="nameField" onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} type="text" placeholder={userName}></input>
      <button type="submit">Edit</button>
    </form>
  );
}
