"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function WidgetPreviewPage() {
  useEffect(() => {
    // Create script element
    const script = document.createElement("script");
    script.src =
      "https://demo-backend-1-jnh0.onrender.com/widget/chat-widget.js"; // Update with actual path
    script.async = true;
    
    // Append to document
    document.body.appendChild(script);
    
    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
      
      // Remove widget elements
      const widgetContainer = document.getElementById("chat-widget-container");
      if (widgetContainer) {
        document.body.removeChild(widgetContainer);
      }
    };
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Chat Widget Preview</h1>
        
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Testing Environment</h2>
          <p className="mb-4 text-muted-foreground">
            This page shows how your chat widget will look and function when embedded on a website. 
            The chat widget should appear as a floating button in the bottom right corner of the screen.
          </p>
          
          <div className="flex gap-4 mt-6">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reset Widget
            </Button>
            <Button asChild>
              <a href="/">Back to Dashboard</a>
            </Button>
          </div>
        </Card>
        
        <div className="border rounded-lg p-8 min-h-[400px] flex items-center justify-center bg-muted/50">
          <div className="text-center">
            <p className="text-muted-foreground">
              This is a placeholder area representing your website content.
              <br />
              The chat widget should appear at the bottom right of the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}