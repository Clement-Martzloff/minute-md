import { auth } from "@/infrastructure/better-auth/auth";
import Sources from "@/src/components/Sources";
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
      <h1 className="text-2xl font-bold mb-4">Google Drive Documents</h1>
      <Sources userId={session.user.id} />
    </div>
  );
}
