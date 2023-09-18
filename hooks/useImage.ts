"use client"

import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { scaledMouse } from "@/utils/scaledmouse"
import { useMutation } from "convex/react"
import React, { useState } from "react"

type useImageProps = {
    userId: string
    boardId: string
    zoom: number
    maxZIndex: number
}

export function useImage({ userId, boardId, zoom, maxZIndex }: useImageProps) {
    const [initialDragPos, setInitialDragPos] = useState<{ x: number, y: number } | null>(null);
    const [currentImagePos, setCurrentImagePos] = useState<{ id: string, x: number, y: number } | null>(null);

    const updateImage = useMutation(api.images.updateImage)
    const deleteImage = useMutation(api.images.deleteImage)

    function imageDragHandler(e: React.DragEvent) {
        if (e.dataTransfer.items.length === 1) {
            handleImageDrop(e)
        } else {
            handleImageDragStart(e)
        }
    }

    const handleImageDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        const files = e.dataTransfer.files;
        if (files.length === 0) {
            return;
        }

        const { scaledX, scaledY } = scaledMouse(e, zoom)
        const file = files[0];
        if (file.type.startsWith("image/")) {
            // Upload the image to your server or an external service
            const sendImageUrl = new URL(`${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/sendImage`);
            sendImageUrl.searchParams.set("userId", userId);
            sendImageUrl.searchParams.set("boardId", boardId);
            sendImageUrl.searchParams.set("x", `${scaledX}`);
            sendImageUrl.searchParams.set("y", `${scaledY}`);
            sendImageUrl.searchParams.set("width", `${100}`);
            sendImageUrl.searchParams.set("height", `${100}`);
            sendImageUrl.searchParams.set("zIndex", `${maxZIndex}`);
            if (sendImageUrl) {
                await fetch(sendImageUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });
            }
        } else {
            alert("The file name matches an existing pattern or is not a valid image format.");
        }
    };

    async function handleImageResize(image: Doc<"images">) {
        await updateImage({
            imageId: image._id,
            userId: image.userId,
            boardId: image.boardId,
            x: image.x,
            y: image.y,
            width: image.width,
            height: image.height,
            zIndex: maxZIndex,
            storageId: image.storageId
        })
    }

    async function handleImageDragStart(e: React.DragEvent) {
        var img = document.createElement("img");
        img.style.backgroundColor = "red";
        img.style.position = "absolute"; img.style.top = "0px"; img.style.right = "0px";
        document.body.appendChild(img);
        e.dataTransfer.setDragImage(img, 0, 0);
        setInitialDragPos({
            x: e.clientX,
            y: e.clientY
        });
    }

    async function handleImageDragMove(e: React.DragEvent, image: Doc<"images">) {
        e.preventDefault()
        if (!initialDragPos) return;

        //prevent odd release that sets x and y to 0
        if (e.clientX === 0 || e.clientY === 0) return;

        const deltaX = e.clientX - initialDragPos.x;
        const deltaY = e.clientY - initialDragPos.y;

        const newX = image.x + deltaX / zoom;
        const newY = image.y + deltaY / zoom;

        setCurrentImagePos({ id: image._id, x: newX, y: newY });
    }

    async function handleImageDragEnd(e: React.DragEvent, image: Doc<"images">) {
        if (currentImagePos) {
            await updateImage({
                imageId: image._id,
                userId: userId,
                boardId: boardId,
                x: currentImagePos.x,
                y: currentImagePos.y,
                height: image.height,
                width: image.width,
                zIndex: maxZIndex,
                storageId: image.storageId
            })
        }
        setInitialDragPos(null);
        setCurrentImagePos(null);
    }

    async function imageKeyDown(e: React.KeyboardEvent, image: Doc<"images">) {
        if (e.key === "Delete") {
            e.preventDefault();

            // Record the current scroll positions
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            await deleteImage({ imageId: image._id });
            const focusDiv = document.getElementById("focusDiv");
            if (focusDiv) {
                focusDiv.focus();
            }

            // Restore the scroll positions
            window.scrollTo(scrollX, scrollY);
        }
    }

    return {
        imageDragHandler,
        handleImageResize,
        handleImageDragMove,
        handleImageDragEnd,
        imageKeyDown,
        currentImagePos
    }
}