"use client";
import { useState,useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquare,
  ArrowRight,
  Code,
  LineChart,
  Lock,
  Sun,
  Moon,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
    const [scriptTag, setScriptTag] = useState("");

    useEffect(() => {
      const domain = window.location.origin;
      setScriptTag(`<script src="${domain}/widget/chat-widget.js"></script>`);
    }, []);


  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <span className="text-lg font-semibold">Chat Widget</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button>
                Admin Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Enhance Your Website with Smart Chat Support
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Add an AI-powered chat widget to your website in minutes. Provide
            24/7 support to your visitors with intelligent, automated responses.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/widget-preview">
              <Button size="lg" variant="default">
                Try Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Admin Dashboard
                <Lock className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Code className="h-8 w-8 mb-2" />
              <CardTitle>Easy Integration</CardTitle>
              <CardDescription>
                Add to any website with a single line of code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {scriptTag && (
                  <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
                    <code>{scriptTag}</code>
                  </pre>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 mb-2" />
              <CardTitle>AI-Powered Responses</CardTitle>
              <CardDescription>
                Instant, intelligent replies using Google&apos;s Gemini API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Natural language understanding</li>
                <li>Context-aware responses</li>
                <li>24/7 availability</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <LineChart className="h-8 w-8 mb-2" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track and analyze chat interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Conversation history</li>
                <li>User engagement metrics</li>
                <li>Performance analytics</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to Use */}
      <section className="container py-16 border-t">
        <h2 className="text-3xl font-bold tracking-tight mb-8">How to Use</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>1. Add the Widget</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Copy and paste the widget script into your website&apos;s HTML,
                just before the closing body tag.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>2. Configure Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Log in to the admin dashboard to customize the widget&apos;s
                appearance and behavior.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>3. Monitor Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track and manage conversations through the admin dashboard in
                real-time.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>4. Analyze Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View analytics and insights about your chat widget&apos;s
                performance and user engagement.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span className="font-semibold">Chat Widget</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Chat Widget. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
