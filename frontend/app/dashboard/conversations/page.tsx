import { ConversationsList } from "@/components/dashboard/conversations-list";

export default function ConversationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Conversations</h2>
      </div>
      <div className="grid gap-4">
        <ConversationsList />
      </div>
    </div>
  );
}