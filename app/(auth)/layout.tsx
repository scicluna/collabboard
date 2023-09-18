import SplashBoard from "@/components/server/SplashBoard";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="bg-slate-100 h-[100dvh] w-[100dvw]">
            <SplashBoard />
            {children}
        </section>
    )
}
