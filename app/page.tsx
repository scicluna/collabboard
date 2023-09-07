import { UserButton } from "@clerk/nextjs/app-beta/client";
import UserDataLog from "./components/client/UserDataLog";

export default function Page() {
  return (
    <main className="h-[100dvh] w-[100dvw] flex justify-center items-center bg-slate-600">
      <UserDataLog />
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}