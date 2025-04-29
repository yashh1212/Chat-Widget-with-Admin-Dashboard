"use client"; // This line marks the component as a Client Component

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard/dashboard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in by checking the sessionLogin flag in sessionStorage
    const sessionLogin = sessionStorage.getItem("sessionLogin");

    // If sessionLogin is false or not set, redirect to the login page
    if (sessionLogin !== "true") {
      router.replace("/login");
    }
  }, [router]);

  return <Dashboard>{children}</Dashboard>;
}
