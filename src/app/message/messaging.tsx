"use client";
import { useEffect, useRef, useState } from "react";
import { getOrganizationMessages, getVolunteerMessages } from "./actions";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import ClipLoader from "react-spinners/ClipLoader";
import MessageInput from "./messageInput";
import { sthreeImages } from "@/database/sthreeActions";

const Messaging = ({
  userStatus,
  organizationId,
  userId,
  setLoadingTrue,
  setLoadingFalse,
  loading,
}: {
  userStatus: boolean;
  organizationId: string;
  userId?: string;
  setLoadingTrue: () => void;
  setLoadingFalse: () => void;
  loading: boolean;
}) => {
  const [conversations, setConversations] = useState<any>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>();
  const [sthree, setsthree] = useState<any>();

  const chatContainerRef = useRef(null);
  const textboxRef = useRef(null);
  const sthreeload = new sthreeImages();
  useEffect(() => {
    if (chatContainerRef.current) {
      (chatContainerRef.current as any).scrollTop = (
        chatContainerRef.current as any
      ).scrollHeight;
    }
  }, [selectedConversation]);

  const changeSelectedConversation = (selectedConversationId: string) => {
    setConversations((prevState: any) => {
      const updatedConversations = prevState.map((conversation: any) => {
        if (conversation.conversations.id == selectedConversationId) {
          return { ...conversation, selected: true };
        } else {
          return { ...conversation, selected: false };
        }
      });
      return updatedConversations;
    });

    const currentConversation = conversations.find((conversation: any) => {
      return conversation.conversations.id == selectedConversationId;
    });

    setSelectedConversation(currentConversation);
  };

  const addMessage = async (message: any) => {
    if (message.senderId) {
      console.log(message);
      const userImage = await sthree.swap(message);
      console.log(userImage);
      /*selectedConversation.users.find((user: any) => {
        return user.id == message.senderId;
      }).image; */

      const newMessage = {
        ...message,
        content: message.content.replace("/\t/g", "    "),
        userImage: userImage,
      };

      setSelectedConversation((prevState: any) => {
        return { ...prevState, messages: [...prevState.messages, newMessage] };
      });

      setConversations((prevState: any) => {
        const indexOfNewConversation = prevState.findIndex(
          (conversation: any) =>
            conversation.conversations.id == message.conversationId
        );

        // If the conversation is found, proceed to update it
        if (indexOfNewConversation !== -1) {
          const oldConversations = [...prevState]; // Make a shallow copy of the previous state

          const newConversation = oldConversations[indexOfNewConversation]; // Get the existing conversation

          // Update the messages of the found conversation
          const updatedConversation = {
            ...newConversation,
            messages: [...newConversation.messages, newMessage],
          };

          // Use splice to update the conversation in the array
          oldConversations.splice(
            indexOfNewConversation,
            1,
            updatedConversation
          );

          return oldConversations; // Return the modified array
        }

        // If the conversation isn't found, return the original state (or handle accordingly)
        return prevState;
      });
    } else if (message.senderOrganizationId) {
      const organizationImage = selectedConversation.organizations.find(
        (org: any) => {
          return org.id == message.senderOrganizationId;
        }
      ).thumbnail;

      const newMessage = {
        ...message,
        content: message.content.replace(/\t/g, "    "),
        organizationImage: organizationImage,
      };

      setSelectedConversation((prevState: any) => {
        return { ...prevState, messages: [...prevState.messages, newMessage] };
      });

      setConversations((prevState: any) => {
        const indexOfNewConversation = prevState.findIndex(
          (conversation: any) =>
            conversation.conversations.id == message.conversationId
        );

        if (indexOfNewConversation !== -1) {
          const oldConversations = [...prevState];

          const newConversation = oldConversations[indexOfNewConversation];

          const updatedConversation = {
            ...newConversation,
            messages: [...newConversation.messages, newMessage],
          };

          oldConversations.splice(
            indexOfNewConversation,
            1,
            updatedConversation
          );

          return oldConversations;
        }

        return prevState;
      });
    }
  };

  const getOrganizationMessagesMethod = async () => {
    setLoadingTrue();
    const [organizationMessages, organizationMessageError] =
      await getOrganizationMessages({
        organizationId: organizationId,
      });

    if (organizationMessages) {
      const editedOrganizationMessages =
        await sthreeload.process(organizationMessages);
      setsthree(sthreeload);
      setConversations([
        ...editedOrganizationMessages.map((org: any) => {
          return {
            ...org,
            selected: false,
          };
        }),
      ]);
    } else {
      setConversations([]);
    }

    setSelectedConversation(null);

    setLoadingFalse();
  };

  const getVolunteerMessagesMethod = async () => {
    setLoadingTrue();
    const [volunteerMessages, volunteerMessageError] =
      await getVolunteerMessages();

    if (volunteerMessages) {
      const editedVolunteerMessages =
        await sthreeload.process(volunteerMessages);
      setsthree(sthreeload);
      setConversations([
        ...editedVolunteerMessages.map((volunteer: any) => {
          return {
            ...volunteer,
            selected: false,
          };
        }),
      ]);
    } else {
      setConversations([]);
    }

    setSelectedConversation(null);

    setLoadingFalse();
  };
  useEffect(() => {
    if (userStatus) {
      getOrganizationMessagesMethod();
    } else {
      getVolunteerMessagesMethod();
    }
  }, [userStatus, userId, organizationId]);
  return (
    <>
      {loading ? (
        <ClipLoader />
      ) : conversations.length > 0 ? (
        <div className="flex flex-row w-full m-auto border border-2 rounded-xl border-black h-[800px]">
          <div className="flex flex-col w-2/5 border-r-4 ">
            <div className="flex flex-col w-full w-full bg-slate-300 rounded-tl-xl py-10 text-center font-bold text-2xl">
              Inbox
            </div>
            <div className="overflow-y-auto divide-y overflow-x-hidden">
              {conversations.map((conversation: any, index: number) => {
                let userData = conversation.users.map(
                  (user: any, index: number) => {
                    return {
                      id: index,
                      name: user.name,
                      image: user.image,
                      designation: "USER",
                    };
                  }
                );

                let organizationData = conversation.organizations.map(
                  (org: any, index: number) => {
                    return {
                      id: index + conversation.users.length,
                      name: org.name,
                      image: JSON.parse(org.thumbnail).storageId,
                      designation: "ORGANIZATION",
                    };
                  }
                );
                return (
                  <div
                    className={`flex flex-col justify-center cursor-pointer items-start p-5 ${index == conversations.length - 1 ? "rounded-bl-xl" : ""} ${conversation.selected ? "border-l-4 border-l-indigo-500" : null}`}
                    key={conversation.conversations.id}
                    onClick={() =>
                      changeSelectedConversation(conversation.conversations.id)
                    }
                  >
                    <h1 className="text-center w-full font-bold text-lg mb-2">
                      {conversation.conversations.subject}
                    </h1>
                    <div className="flex flex-col xl:flex-row w-full justify-start gap-2 items-start">
                      <div className="flex flex-col items-center justify-start w-fit font-bold">
                        <h1 className="text-sm">Users</h1>
                        <div className="flex flex-row items-center justify-start w-full">
                          {userData.length > 0 ? (
                            <AnimatedTooltip items={userData} />
                          ) : (
                            <h1 className="text-center w-full">NONE</h1>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-start w-fit font-bold">
                        <h1 className="text-sm">Organizations</h1>
                        <div className="flex flex-row items-center justify-start w-full">
                          {organizationData.length > 0 ? (
                            <AnimatedTooltip items={organizationData} />
                          ) : (
                            <h1 className="text-center w-full">NONE</h1>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col w-4/5 h-full">
            <div className="w-full flex flex-col h-full">
              {selectedConversation ? (
                <div className="flex flex-col justify-between items-center h-full">
                  <div className="flex flex-col justify-between items-center text-center w-full py-8 border-b-4 border-black">
                    <h1 className="font-bold text-xl mb-2">
                      {selectedConversation.conversations.subject}
                    </h1>
                    <div className="flex flex-row w-full justify-between gap-2 px-5 items-center">
                      <div className="flex flex-col items-center justify-center font-bold">
                        <h1 className="text-sm">Users</h1>
                        <div className="flex flex-row items-center justify-start">
                          {selectedConversation.users.length > 0 ? (
                            <AnimatedTooltip
                              key={
                                selectedConversation.conversations.id + "user"
                              }
                              items={selectedConversation.users.map(
                                (user: any, index: number) => {
                                  return {
                                    id: index,
                                    name: user.name,
                                    image: user.image,
                                    designation: user.bio,
                                  };
                                }
                              )}
                            />
                          ) : (
                            <h1 className="text-center w-full">NONE</h1>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center font-bold">
                        <h1 className="text-sm">Organizations</h1>
                        <div className="flex flex-row items-center justify-center">
                          {selectedConversation.organizations.length > 0 ? (
                            <AnimatedTooltip
                              key={
                                selectedConversation.conversations.id + "org"
                              }
                              items={selectedConversation.organizations.map(
                                (org: any, index: number) => {
                                  return {
                                    id:
                                      index + selectedConversation.users.length,
                                    name: org.name,
                                    image: JSON.parse(org.thumbnail).storageId,
                                    designation: "ORGANIZATION",
                                  };
                                }
                              )}
                            />
                          ) : (
                            <h1 className="text-center w-full">NONE</h1>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="w-full h-full overflow-y-auto p-10 flex flex-col gap-4"
                    ref={chatContainerRef}
                  >
                    {selectedConversation.messages.map((message: any) => {
                      if (message.userImage) {
                        return (
                          <div className="flex flex-row gap-3" key={message.id}>
                            <img
                              src={message.userImage}
                              alt="Sender User"
                              className="w-[100px] h-[100px] rounded-full"
                            />
                            <p className="rounded-xl bg-blue-400 h-fit p-5">
                              {message.content
                                .replace(/^["']|["']$/g, "")
                                .replace(/\\(['"])/g, "$1")}
                            </p>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex flex-row gap-3" key={message.id}>
                            <img
                              src={
                                JSON.parse(message.organizationImage).storageId
                              }
                              alt="Sender Organization"
                              className="w-[100px] h-[100px] rounded-full"
                            />
                            <p className="rounded-xl bg-blue-400 h-fit p-5">
                              {message.content
                                .replace(/^["']|["']$/g, "")
                                .replace(/\\(['"])/g, "$1")}
                            </p>
                          </div>
                        );
                      }
                    })}
                  </div>
                  <div className="py-10 border-t-4 w-full m-auto">
                    <MessageInput
                      userStatus={userStatus}
                      organizationId={userStatus ? organizationId : null}
                      userId={!userStatus ? userId : null}
                      conversationId={selectedConversation.conversations.id}
                      addMessage={addMessage}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-between items-start h-full">
                  <h1 className="font-bold text-xl text-center w-full py-8 border-b-4 border-black">
                    Please Select a Conversation
                  </h1>
                  <div className="w-full h-full"></div>
                  <div className="py-10 border-t-4 w-full m-auto">
                    <MessageInput />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <h1 className="w-full text-center">
          Please create a conversation to start messaging other users.
        </h1>
      )}
    </>
  );
};

export default Messaging;
