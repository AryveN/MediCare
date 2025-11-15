import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isMe: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
}

interface MessagingSystemProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userType: "patient" | "doctor";
  selectedConversationId?: string;
}

export const MessagingSystem = ({
  open,
  onOpenChange,
  userType,
  selectedConversationId
}: MessagingSystemProps) => {
  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      name: userType === "patient" ? "Dr. Sarah Johnson" : "John Doe",
      lastMessage: "Your appointment is confirmed",
      unread: 2
    },
    {
      id: "2",
      name: userType === "patient" ? "Dr. Michael Chen" : "Jane Smith",
      lastMessage: "Please arrive 10 minutes early",
      unread: 0
    }
  ]);

  const [selectedConv, setSelectedConv] = useState<string>(selectedConversationId || conversations[0]?.id);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: userType === "patient" ? "Dr. Sarah Johnson" : "John Doe",
      content: "Hello! How can I help you today?",
      timestamp: new Date(Date.now() - 3600000),
      isMe: false
    },
    {
      id: "2",
      sender: "Me",
      content: "I need to reschedule my appointment",
      timestamp: new Date(Date.now() - 1800000),
      isMe: true
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: "Me",
      content: newMessage,
      timestamp: new Date(),
      isMe: true
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[600px] p-0">
        <div className="grid grid-cols-3 h-full">
          {/* Conversations List */}
          <div className="border-r border-border">
            <DialogHeader className="p-4 border-b border-border">
              <DialogTitle>Messages</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(600px-4rem)]">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={`w-full p-4 text-left hover:bg-accent transition-colors border-b border-border ${
                    selectedConv === conv.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>{conv.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate">{conv.name}</p>
                        {conv.unread > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Messages Area */}
          <div className="col-span-2 flex flex-col">
            <DialogHeader className="p-4 border-b border-border">
              <DialogTitle>
                {conversations.find(c => c.id === selectedConv)?.name}
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isMe
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
