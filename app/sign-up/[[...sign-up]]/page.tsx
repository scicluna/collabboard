import SplashBoard from "@/components/server/SplashBoard";
import { SignUp } from "@clerk/nextjs/app-beta";

export default function Page() {
    return (
        <main className="h-full flex justify-center items-center bg-slate-100">
            <SplashBoard />
            <SignUp />
        </main>);
}