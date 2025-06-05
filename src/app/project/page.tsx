import { auth } from "@/infrastructure/framework/better-auth/auth";
import { generateMeetingReportFromSources } from "@/infrastructure/framework/nextjs/generate-meeting-report-from-sources";
import SelectedSourcesView from "@/src/app/project/components/SelectedSourcesView";
import Sources from "@/src/app/project/components/Sources";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DrivePage() {
  const session = await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-4">
      <Sources />
      <SelectedSourcesView handleClick={generateMeetingReportFromSources} />
    </div>
  );
}
