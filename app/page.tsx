import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation"
import { UserButton } from "@clerk/nextjs/app-beta/client";

export default async function Page() {
  //check for user and redirect towards dashboard or signin
  const user = await currentUser();

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="h-full flex justify-center items-center">
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}