"use client"
import { Doc } from "@/convex/_generated/dataModel"
import { useState } from "react"
import Image from "next/image"
import mappin from "@/public/mappin.png"

type PinProps = {
    pin: Doc<"pins">
}

export default function Pin({ pin }: PinProps) {
    const [focus, setFocus] = useState(false)
    return (
        <div
            key={pin._id}
            style={{ top: `${pin.y}px`, left: `${pin.x}px` }}
            className={`absolute pin h-16 w-12 z-30 ${focus && 'text-red-600'} -translate-x-1/2 -translate-y-1/2`}
            data-id={pin._id}
            tabIndex={0}
            onClick={e => setFocus(true)}
            onBlur={e => setFocus(false)}
        >
            <Image src={mappin} alt={'map pin'} fill />
        </div>
    )
}