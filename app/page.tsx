import { UserButton } from "@clerk/nextjs/app-beta/client";

export default function Page() {
  return (
    <main className="h-[100dvh] w-[100dvw] flex justify-center items-center bg-slate-600">
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}