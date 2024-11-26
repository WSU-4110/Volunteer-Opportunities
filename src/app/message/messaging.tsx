"use client";
import { useEffect, useRef, useState } from "react";
import { getOrganizationMessages, getVolunteerMessages } from "./actions";
import {
  AnimatedLinkTooltip,
  AnimatedTooltip,
} from "@/components/ui/animated-tooltip";
import ClipLoader from "react-spinners/ClipLoader";
import MessageInput from "./messageInput";
import BackIcon from "@/components/icons/backIcon";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher-client";

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
  const [conversationIds, setConversationIds] = useState<any>([]);

  const [mobileViewConvSelected, setMobileViewConvSelected] = useState(false);

  const chatContainerRef = useRef(null);

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

    setMobileViewConvSelected(true);
  };

  const handleMobileViewChangeClick = () => {
    setMobileViewConvSelected(false);
    setSelectedConversation(null);
    setConversations((prevState: any) => [
      ...prevState.map((item: any) => {
        return { ...item, selected: false };
      }),
    ]);
  };

  const addMessage = (message: any) => {
    if (message.senderId) {
      const newMessage = {
        ...message,
        content: message.content.replace("/\t/g", "    "),
        userImage: message.userImage,
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
    } else if (message.senderOrganizationId) {
      const newMessage = {
        ...message,
        content: message.content.replace(/\t/g, "    "),
        organizationImage: message.organizationImage,
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
      setConversations([
        ...organizationMessages.map((org) => {
          return {
            ...org,
            selected: false,
          };
        }),
      ]);

      for (let conversation of organizationMessages) {
        pusherClient.subscribe(conversation.conversations.id);

        setConversationIds((prevState: any) => [
          ...prevState,
          conversation.conversations.id,
        ]);
      }
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
      setConversations([
        ...volunteerMessages.map((volunteer) => {
          return {
            ...volunteer,
            selected: false,
          };
        }),
      ]);

      for (let conversation of volunteerMessages) {
        pusherClient.subscribe(conversation.conversations.id);

        setConversationIds((prevState: any) => [
          ...prevState,
          conversation.conversations.id,
        ]);
      }
    } else {
      setConversations([]);
    }

    setSelectedConversation(null);

    setLoadingFalse();
  };
  useEffect(() => {
    const subscribeToConversations = () => {
      conversations.forEach((conversation: any) => {
        if (!conversationIds.includes(conversation.conversations.id)) {
          pusherClient.subscribe(conversation.conversations.id);
          setConversationIds((prevState: any) => [
            ...prevState,
            conversation.conversations.id,
          ]);
        }
      });
    };

    if (userStatus) {
      getOrganizationMessagesMethod().then(subscribeToConversations);
    } else {
      getVolunteerMessagesMethod().then(subscribeToConversations);
    }

    pusherClient.bind("incoming-message", addMessage);

    setMobileViewConvSelected(false);

    return () => {
      // Unsubscribe from all conversations
      conversationIds.forEach((conversationId: string) => {
        pusherClient.unsubscribe(conversationId);
      });
      pusherClient.unbind("incoming-message", addMessage);
    };
  }, [userStatus, userId, organizationId]);
  return (
    <>
      {loading ? (
        <ClipLoader />
      ) : conversations.length > 0 ? (
        <div className="flex flex-row w-full m-auto border border-2 border-black h-[800px]">
          <div
            className={`flex overflow-y-auto flex-col w-full h-full xl:w-2/5 border-r-4 ${mobileViewConvSelected ? "hidden" : "block"} xl:block`}
          >
            <div className="flex flex-col w-full w-full bg-slate-300 py-10 text-center font-bold text-2xl">
              Inbox
            </div>
            <div className="divide-y">
              {conversations.map((conversation: any, index: number) => {
                let userData = conversation.users.map(
                  (user: any, index: number) => {
                    return {
                      id: user.id,
                      name: user.name,
                      image: user.image,
                      designation: "USER",
                    };
                  }
                );

                let organizationData = conversation.organizations.map(
                  (org: any, index: number) => {
                    return {
                      id: org.id,
                      name: org.name,
                      image: JSON.parse(org.thumbnail).storageId,
                      designation: "ORGANIZATION",
                    };
                  }
                );
                return (
                  <div
                    className={`flex flex-col justify-center cursor-pointer items-start p-5 ${conversation.selected ? "border-l-4 border-l-indigo-500" : null}`}
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
          <div
            className={`flex flex-col w-full xl:w-4/5 h-full ${mobileViewConvSelected ? "block" : "hidden"} xl:block`}
          >
            <div className="w-full flex flex-col h-full">
              {selectedConversation ? (
                <div className="flex flex-col justify-between items-center h-full">
                  <div className="flex flex-col justify-between items-center w-full py-8 px-4 border-b-4 border-black gap-5 xl:gap-0">
                    <div className="flex flex-row justify-start w-full items-start">
                      <div
                        className="flex flex-col justify-center cursor-pointer"
                        onClick={handleMobileViewChangeClick}
                      >
                        {mobileViewConvSelected ? (
                          <BackIcon className="text-left w-[30px] h-[30px] w-fit xl:hidden"></BackIcon>
                        ) : null}
                        <p className="xl:hidden">Back</p>
                      </div>
                      <h1 className="font-bold text-xl mb-2 w-full text-center">
                        {selectedConversation.conversations.subject}
                      </h1>
                    </div>
                    <div className="flex flex-row w-full justify-between gap-2 px-5 items-center">
                      <div className="flex flex-col items-center justify-center font-bold">
                        <h1 className="text-sm">Users</h1>
                        <div className="flex flex-row items-center justify-start">
                          {selectedConversation.users.length > 0 ? (
                            <AnimatedLinkTooltip
                              key={
                                selectedConversation.conversations.id + "user"
                              }
                              items={selectedConversation.users.map(
                                (user: any, index: number) => {
                                  return {
                                    id: user.id,
                                    name: user.name,
                                    image: user.image,
                                    designation: user.bio,
                                  };
                                }
                              )}
                              type="volunteer"
                              className="cursor-pointer"
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
                            <AnimatedLinkTooltip
                              key={
                                selectedConversation.conversations.id + "org"
                              }
                              items={selectedConversation.organizations.map(
                                (org: any, index: number) => {
                                  return {
                                    id: org.id,
                                    name: org.name,
                                    image: JSON.parse(org.thumbnail).storageId,
                                    designation: "ORGANIZATION",
                                  };
                                }
                              )}
                              className="cursor-pointer"
                              type="organization"
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
                              className="w-[40px] h-[40px] rounded-full"
                            />
                            <p className="rounded-xl bg-blue-400 h-fit p-3 text-sm">
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
                              className="w-[40px] h-[40px] rounded-full"
                            />
                            <p className="rounded-xl bg-blue-400 h-fit p-3 text-sm">
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
                      selectedConversation={selectedConversation}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-between items-start h-full">
                  <h1 className="font-bold text-xl text-center w-full py-10 border-b-4 border-black">
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
