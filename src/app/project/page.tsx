import { auth } from "@/infrastructure/framework/better-auth/auth";
// import { generateMeetingReport } from "@/infrastructure/framework/nextjs/generate-meeting-report";
import GooglePickerButton from "@/src/app/project/components/GooglePickerButton";
import SelectedSourcesList from "@/src/app/project/components/SelectedSourcesList";
// import SelectedSourcesView from "@/src/app/project/components/SelectedSourcesView";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReportGenerator } from "./components/ReportGenerator";

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
    <div className="container mx-auto p-4 flex flex-col items-center">
      <GooglePickerButton />
      <SelectedSourcesList />
      {/* <SelectedSourcesView handleClick={generateMeetingReport} /> */}
      <ReportGenerator />
    </div>
  );
}
