import React from "react";
import { getCurrentSession } from "@/lib/auth/session";
import LandingPage from "@/components/landing/LandingPage";
import SearchDashboard from "@/components/SearchDashboard";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: {
    view?: string;
    mode?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const session = await getCurrentSession();
  const isAuthenticated = !!session?.userId;

  // If user is authenticated and did NOT explicitly ask to view the public landing tour (?view=landing),
  // render the active SearchDashboard workspace
  if (isAuthenticated && searchParams?.view !== "landing") {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        <SearchDashboard initialMode={searchParams?.mode} />
      </div>
    );
  }

  // Otherwise (unauthenticated visitor OR explicit ?view=landing query),
  // render the full-featured SaaS landing page
  return <LandingPage isAuthenticated={isAuthenticated} />;
}
