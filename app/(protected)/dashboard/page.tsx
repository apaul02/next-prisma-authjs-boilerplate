import { DashboardPage } from "@/components/Dashboard";
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  return (
    <div>
      {JSON.stringify(session!.user)}
      <DashboardPage />
    </div>
  )
}