"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/sidebar-provider";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  MessageSquare,
  Settings,
  User,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useTheme } from "next-themes";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Conversations",
    href: "/dashboard/conversations",
    icon: <MessageSquare className="h-5 w-5" />,
  }
  

];

export function Dashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);

    // Check sessionLogin flag from sessionStorage
    const sessionLogin = sessionStorage.getItem("sessionLogin");
    if (sessionLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Update isMobile state based on window size
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  const handleLogout = () => {
    // Set sessionLogin to false and redirect to login page
    sessionStorage.setItem("sessionLogin", "false");
    setIsLoggedIn(false);
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300 md:relative",
          isOpen ? "w-64" : "w-[70px]",
          isMobile ? "hidden" : "flex"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center px-4 transition-all duration-300",
            isOpen ? "justify-between" : "justify-center"
          )}
        >
          {isOpen ? (
            <span className="font-semibold">Chat Admin</span>
          ) : (
            <MessageSquare className="h-6 w-6" />
          )}
          <Button variant="ghost" size="icon" onClick={toggle}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                  !isOpen && "justify-center"
                )}
              >
                {item.icon}
                {isOpen && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div
          className={cn(
            "border-t p-4 transition-all duration-300",
            isOpen ? "block" : "hidden"
          )}
        >
          <div className="flex items-center gap-3">
            <User className="h-9 w-9 rounded-full bg-muted p-2" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@gmail.com</p>
            </div>
          </div>
          {isLoggedIn && (
            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" /> Logout
            </Button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      {mounted && isMobile && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="left" className="p-0">
            <div className="flex h-16 items-center border-b px-4">
              <span className="font-semibold">Chat Admin</span>
            </div>
            <nav className="grid gap-1 p-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsSheetOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <User className="h-9 w-9 rounded-full bg-muted p-2" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">
                    admin@example.com
                  </p>
                </div>
              </div>
              {isLoggedIn && (
                <Button
                  variant="destructive"
                  className="w-full mt-4"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" /> Logout
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          {mounted && isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSheetOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
