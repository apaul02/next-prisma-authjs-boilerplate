import { auth } from "@/lib/auth"
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if(!session?.user) {
    redirect("/")
  }
  return (
    <div>
      {JSON.stringify(session.user)}
    </div>
  )
}