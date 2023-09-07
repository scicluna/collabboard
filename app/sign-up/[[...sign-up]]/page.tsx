import { SignUp } from "@clerk/nextjs/app-beta";

export default function Page() {
    return (
        <main className="h-[100dvh] w-[100dvw] flex justify-center items-center bg-slate-600">
            <SignUp />
        </main>);
}