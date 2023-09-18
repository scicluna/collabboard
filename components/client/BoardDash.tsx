import { UserButton } from "@clerk/nextjs/app-beta/client";
import Image from 'next/image'
import logo from "@/public/investigatorlogo.png"
import Link from "next/link"

export default function BoardDash() {
    return (
        <nav className="fixed top-0 left-0 w-full px-5  flex gap-6 justify-between items-cente h-16 text-black">
            <Link href={'/dashboard'} className="w-[36px] flex justify-start h-full items-center">
                <Image src={logo} alt="logo" width={36} height={36} />
            </Link>
            <div className="w-[36px] flex justify-end relative h-full items-center">
                <UserButton />
                <div className="h-[31px] w-[31px] border border-indigo-300 rounded-full absolute top-0 translate-y-1/2 bg-indigo-300 -z-10" />
            </div>
        </nav>
    )
}