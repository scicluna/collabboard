import { Doc } from "@/convex/_generated/dataModel"
import Image from "next/image"

type ImageCardProps = {
    image: Doc<"images"> & { url: string | null }
}

export default function ImageCard({ image }: ImageCardProps) {

    if (!image.url) return;

    return (
        <Image src={image.url} alt={"uploaded image"} width={image.width} height={image.height}
            style={{ position: 'absolute', left: image.x, top: image.y }} />
    )
}