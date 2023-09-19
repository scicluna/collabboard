
import { SignUp } from "@clerk/nextjs/app-beta";

export default function Page({
    searchParams,
}: {
    searchParams: { redirect_url: string }
}) {
    return (
        <main className="h-full flex justify-center items-center bg-slate-100">
            <SignUp redirectUrl={searchParams.redirect_url} />
        </main>);
}