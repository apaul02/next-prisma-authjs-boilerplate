"use client";
import { signOut } from "next-auth/react"
import { Button } from "./ui/button";

export function DashboardPage() {
  return (
    <div>
      <Button onClick={() => {signOut()}}>Sign Out</Button>
    </div>
  )
}