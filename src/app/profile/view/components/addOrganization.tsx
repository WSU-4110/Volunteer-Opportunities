"use client";
import React from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  revalidatePathAction,
  addOrganization,
} from "@/app/profile/view/actions";

import { FileUpload } from "./fileUpload";

export default function AddAnOrganization(props: any) {
  const orgSchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
  });

  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  async function onSubmit(values: z.infer<typeof orgSchema>) {
    try {
      const data: File = await files[0];

      console.log("Submit");
      console.log(data);
      const form: FormData = new FormData();
      form.append("data", data);

      addOrganization({
        picture: values.imageUrl,
        name: values.name,
        data: form,
      });

      revalidatePathAction();
      props.addOrganization(false);
    } catch (error) {}
  }
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };
  return (
    <div className="w-1/2 m-auto mt-20">
      <header className="text-2xl text-center font-bold">
        Add an Organization
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FileUpload onChange={handleFileUpload} />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormDescription>Change your organization name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <table>
            <tbody>
              <tr>
                <td>
                  <Button type="submit">Submit</Button>
                </td>
                <td>
                  <Button
                    onClick={() => {
                      props.addOrganization(false);
                    }}
                    type="button"
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </Form>
    </div>
  );
}
