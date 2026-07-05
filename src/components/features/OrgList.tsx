import React from "react";
import { Organization } from "../../data/orgs";
import { OrgCard } from "./OrgCard";

interface OrgListProps {
  orgs: Organization[];
}

export function OrgList({ orgs }: OrgListProps) {
  if (orgs.length === 0) {
    return (
      <div className="max-w-3xl mx-auto rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-10 text-center text-sm text-gray-700 dark:text-gray-300">
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No organizations found</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Try adjusting your search criteria to discover more organizations.
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {orgs.map((org) => (
        <OrgCard key={org.slug} org={org} />
      ))}
    </div>
  );
}
