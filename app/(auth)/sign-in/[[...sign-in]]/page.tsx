import { SignIn } from "@clerk/nextjs/app-beta";

export default function Page() {
    return (
        <main className="h-full flex justify-center items-center bg-slate-100">
            <SignIn />
        </main>);
}