import { UserButton } from "@clerk/nextjs/app-beta/client";
import UserDataLog from "./components/client/UserDataLog";

export default function Page() {
  //check for user and redirect towards dashboard or signin
  return (
    <main className="h-full flex justify-center items-center">
      <UserDataLog />
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}