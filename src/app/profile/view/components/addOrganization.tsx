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
    addOrganization({ picture: values.imageUrl, name: values.name });
    revalidatePathAction();
    props.addOrganization(false);
  }
  return (
    <div className="w-1/2 m-auto mt-20">
      <header className="text-2xl text-center font-bold">
        Add an Organization
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placeholder for image upload</FormLabel>
                <FormControl>
                  <Input placeholder="imageUrl" {...field} />
                </FormControl>
                <FormDescription>add an image</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
