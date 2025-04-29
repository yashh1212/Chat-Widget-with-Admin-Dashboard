"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully."
      });
    }, 1000);
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Widget Appearance</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your chat widget general settings
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="widget-name">Widget Name</Label>
                  <Input id="widget-name" defaultValue="Chat Support" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Input id="welcome-message" defaultValue="Welcome! How can I help you today?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offline-message">Offline Message</Label>
                  <Input id="offline-message" defaultValue="Sorry, we're currently offline. Please leave a message and we'll get back to you." />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Widget Appearance</CardTitle>
              <CardDescription>
                Customize how your chat widget looks
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input id="primary-color" type="color" defaultValue="#3B82F6" className="w-16 h-10" />
                    <Input type="text" defaultValue="#3B82F6" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <Input id="text-color" type="color" defaultValue="#FFFFFF" className="w-16 h-10" />
                    <Input type="text" defaultValue="#FFFFFF" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bubble-icon">Bubble Icon</Label>
                  <select id="bubble-icon" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="chat">Chat Bubble</option>
                    <option value="help">Help</option>
                    <option value="message">Message</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Gemini API Key</Label>
                <div className="flex gap-2">
                  <Input id="api-key" type="password" defaultValue="AIzaSyDEEE_xpATrrmBt1oAzErSPLgfSebKlr4k" />
                  <Button variant="outline">Show</Button>
                  <Button variant="outline">Copy</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Used for AI-powered responses in your chat widget
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://yourdomain.com/webhook/chat" />
                <p className="text-sm text-muted-foreground">
                  Receive notifications for new chat messages (optional)
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}