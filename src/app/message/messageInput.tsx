"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Organizations } from "@/database/schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createMessage } from "./actions";

const SendMessage = ({
  userStatus,
  organizationId,
  userId,
  conversationId,
  addMessage,
}: {
  userStatus?: boolean;
  organizationId?: string | null;
  userId?: string | null;
  conversationId?: string;
  addMessage?: (message: any) => void;
}) => {
  const formSchema = z.object({
    content: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const content = form.watch("content");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(organizationId);

    console.log(typeof organizationId);
    const newMessage = await createMessage({
      ...values,
      senderOrganizationId: organizationId || null,
      senderUserId: userId || null,
      conversationId: conversationId || "",
    });

    if (addMessage) {
      addMessage(newMessage[0]);
    }

    form.reset({ content: "" });
  }

  return (
    <div className="m-auto w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row w-full gap-10 justify-center items-center w-full px-5"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="w-full">
                  <Textarea
                    placeholder="Type Your Message Here"
                    className="resize-none w-full"
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={
              content == "" || !conversationId || (!userId && !organizationId)
            }
          >
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SendMessage;
