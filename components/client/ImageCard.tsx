"use client"
import { Doc } from "@/convex/_generated/dataModel"
import Image from "next/image"
import ResizeWrapper from "./ResizeWrapper";
import { useState } from "react";

type ImageCardProps = {
    image: Doc<"images"> & { url: string | null }
    handleImageResize: (image: Doc<"images">) => void
    handleImageDragStart: (e: React.DragEvent) => void
    handleImageDragMove: (e: React.DragEvent, image: Doc<"images">) => void
    handleImageDragEnd: (e: React.DragEvent, image: Doc<"images">) => void
    imageKeyDown: (e: React.KeyboardEvent, image: Doc<"images">) => void
    currentImagePos: { id: string, x: number, y: number } | null
}

export default function ImageCard({ image, handleImageResize, handleImageDragStart, handleImageDragMove, handleImageDragEnd, imageKeyDown, currentImagePos }: ImageCardProps) {
    const [focused, setFocused] = useState(false)

    if (!image.url) return;

    return (
        <ResizeWrapper focused={focused} setFocused={setFocused} doc={image} onUpdate={handleImageResize} moving={currentImagePos} >
            <Image src={image.url} alt={"uploaded image"} fill className="!inset-0 image outline-none"
                style={{ position: 'absolute', left: image.x, top: image.y }}
                draggable={true}
                onDragStart={handleImageDragStart}
                onDrag={e => handleImageDragMove(e, image)}
                onDragEnd={e => handleImageDragEnd(e, image)}
                onKeyDown={e => imageKeyDown(e, image)}
                tabIndex={0}
            />
        </ResizeWrapper>
    )
}