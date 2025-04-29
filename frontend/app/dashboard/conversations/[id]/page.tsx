"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Message {
  _id: string;
  conversationId: string;
  content: string;
  sender: "user" | "ai" | "system";
  timestamp: string;
}

interface Conversation {
  _id: string;
  visitorId: string;
  startedAt: string;
  lastMessageAt: string;
  metadata?: {
    userAgent?: string;
    referrer?: string;
    pageUrl?: string;
  };
}

export default function ConversationDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:5000/api/conversations/${params.id}`
        );
        setConversation(data.conversation);
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching conversation:", error);
        toast({
          title: "Error",
          description: "Failed to load conversation details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchConversation();
    }
  }, [params.id, toast]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Conversation Details
        </h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 xl:grid-cols-4">
          <Card className="xl:col-span-3">
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
              <CardDescription>
                {conversation
                  ? `Started on ${format(
                      new Date(conversation.startedAt),
                      "PPP 'at' p"
                    )}`
                  : "Conversation details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : message.sender === "ai"
                            ? "bg-muted rounded-bl-none"
                            : "bg-amber-100 text-amber-900 w-full text-center"
                        }`}
                      >
                        <div className="mb-1">
                          <span className="text-xs opacity-70">
                            {format(new Date(message.timestamp), "p")}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Visitor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Visitor ID
                  </div>
                  <div className="font-mono text-sm break-all">
                    {conversation?.visitorId}
                  </div>
                </div>

                {conversation?.metadata?.userAgent && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      User Agent
                    </div>
                    <div className="text-sm break-all">
                      {conversation.metadata.userAgent}
                    </div>
                  </div>
                )}

                {conversation?.metadata?.referrer && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Referrer
                    </div>
                    <div className="text-sm break-all">
                      {conversation.metadata.referrer}
                    </div>
                  </div>
                )}

                {conversation?.metadata?.pageUrl && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Page URL
                    </div>
                    <div className="text-sm break-all">
                      {conversation.metadata.pageUrl}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversation Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Messages
                  </div>
                  <div>{messages.length}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-muted-foreground">
                    User Messages
                  </div>
                  <div>
                    {messages.filter((m) => m.sender === "user").length}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-muted-foreground">
                    AI Responses
                  </div>
                  <div>{messages.filter((m) => m.sender === "ai").length}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-muted-foreground">
                    System Messages
                  </div>
                  <div>
                    {messages.filter((m) => m.sender === "system").length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
