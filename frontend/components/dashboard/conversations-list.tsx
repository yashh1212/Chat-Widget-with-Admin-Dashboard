"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format, formatDistance } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

interface Conversation {
  _id: string;
  visitorId: string;
  startedAt: string;
  lastMessageAt: string;
}

export function ConversationsList() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:5000/api/conversations");
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchQuery.trim()) {
        const { data } = await axios.get(`http://localhost:5000/api/search?query=${encodeURIComponent(searchQuery)}`);
        setConversations(data);
      } else {
        const { data } = await axios.get("http://localhost:5000/api/conversations");
        setConversations(data);
      }
    } catch (error) {
      console.error("Error searching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/conversations/${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Conversations</CardTitle>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button type="submit" size="icon" onClick={handleSearch}>
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor ID</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No conversations found
                    </TableCell>
                  </TableRow>
                ) : (
                  conversations.map((conversation) => (
                    <TableRow 
                      key={conversation._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(conversation._id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="truncate max-w-[200px]">{conversation.visitorId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(conversation.startedAt), "PP")}
                      </TableCell>
                      <TableCell>
                        {formatDistance(new Date(conversation.lastMessageAt), new Date(), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        {formatDistance(
                          new Date(conversation.startedAt),
                          new Date(conversation.lastMessageAt)
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}