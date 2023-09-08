import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image"
import logo from "@/public/investigatorlogo.png"
import { UserButton } from "@clerk/nextjs";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */

export default function UserDash() {
    return (
        <nav className="h-[5dvh] w-full bg-slate-900 bg-opacity-60 flex items-center justify-between sm:p-10 p-5 shadow-md shadow-slate-950">
            <div className="w-1/3 flex justify-start h-[30px] items-center">
                <button className="hover:text-gray-400 focus:outline-[3px] focus:outline focus:outline-indigo-300 rounded-full h-full transition-all duration-15 outline-none items-center flex" >
                    <FontAwesomeIcon icon={faGear} color="gray" className="text-3xl" />
                </button>
            </div>
            <div className="w-1/3 flex justify-center h-full items-center">
                <Image src={logo} alt="logo" width={36} height={36} />
            </div>
            <div className="w-1/3 flex justify-end relative h-full items-center">
                <UserButton />
                <div className="h-[31px] w-[31px] border border-indigo-300 rounded-full absolute top-0 -translate-y-1/2 bg-indigo-300 -z-10" />
            </div>
        </nav>
    )
}