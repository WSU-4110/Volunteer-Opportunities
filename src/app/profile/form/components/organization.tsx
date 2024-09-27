"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//From https://ui.shadcn.com/docs/components/form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  id: z.string(),
});

const EditOrgPage = ({ ...props }: any) => {
  const orgSchema = z.object({
    name: z.string(),
    description: z.string(),
  });

  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: props.values.name,
      description: props.values.bio,
    },
  });
  async function onSubmit(values: z.infer<typeof orgSchema>) {}

  return (
    <div>
      <div className="w-full m-auto mt-10">
        <img
          src={props.values.picture}
          alt="User Profile Picture"
          className="m-auto rounded-xl"
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter Your Bio</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

const ViewOrgPage = ({ ...props }: any) => {
  return <div>Viewer</div>;
};

export default function Organization(props: any) {
  //From https://ui.shadcn.com/docs/components/form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "0",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {}
  return (
    <div className="w-1/2 m-auto mt-20">
      <>
        {
          (props.organizations.length! += 0 ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="id" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {props.organizaitons.map(
                            (org: { id: string; name: string }) => (
                              <SelectItem
                                value={org.id}
                                key={org.id}
                                id={org.id}
                              >
                                {org.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Select</Button>
              </form>
            </Form>
          ) : (
            <></>
          ))
        }
      </>
      <>{props.editProfile ? <EditOrgPage /> : <ViewOrgPage />}</>
    </div>
  );
}
