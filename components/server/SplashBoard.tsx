import Image from "next/image";
import splashboard from "@/public/splashboard.jpg"

export default function SplashBoard() {
    return (
        <div className="absolute h-screen w-screen">
            <Image src={splashboard} alt={"white board splash"} fill className="object-cover" />
        </div>
    )
}