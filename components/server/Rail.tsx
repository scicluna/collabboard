import Image from 'next/image'
import rail from "@/public/RailingSketch2.webp"

export default function BottomRail({ zoom }: { zoom: number }) {
    return (
        <div className='absolute pointer-events-none w-[2600px] h-[1600px] z-20 noSelect'
            draggable={false}
            style={{ transform: `scale(${zoom})` }}>
            <Image src={rail} alt={"whiteboard railing"} fill />
        </div>

    )
}