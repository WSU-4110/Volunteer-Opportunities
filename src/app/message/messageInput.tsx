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
  selectedConversation,
}: {
  userStatus?: boolean;
  organizationId?: string | null;
  userId?: string | null;
  conversationId?: string;
  addMessage?: (message: any) => void;
  selectedConversation?: any;
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
    const [newMessage, newMessageError] = await createMessage({
      ...values,
      senderOrganizationId: organizationId || null,
      senderUserId: userId || null,
      conversationId: conversationId || "",
      userImage: userId
        ? selectedConversation.users.find((user: any) => {
            return user.id == userId;
          }).image
        : null,
      organizationImage: organizationId
        ? selectedConversation.organizations.find((organization: any) => {
            return organization.id == organizationId;
          }).thumbnail
        : null,
    });

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
