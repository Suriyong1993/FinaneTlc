"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ChurchApp from "@/components/ChurchApp";
import { LoadingSpinner } from "@/components/ui";

export default function Home() {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace("/login");
    }
  }, [loading, authenticated, router]);

  if (loading) return <LoadingSpinner />;
  if (!authenticated) return null;

  return <ChurchApp />;
}
