"use client"

import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import React, { useState } from "react"

type usePinToolProps = {
    pinToolActive: boolean
    zoom: number
    userId: string
    boardId: string
}

export function usePinTool({ pinToolActive, zoom, userId, boardId }: usePinToolProps) {
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [initialDragPos, setInitialDragPos] = useState<{ x: number, y: number } | null>(null)
    const [currentPinPos, setCurrentPos] = useState<{ id: string, x: number, y: number } | null>(null);
    const [linking, setLinking] = useState(false);
    const [linkingPins, setLinkingPins] = useState<string[]>(new Array(2).fill(null))

    const createNewPin = useMutation(api.pins.createNewPin);
    const connectTwoPins = useMutation(api.pins.linkTwoPins);
    const updatePin = useMutation(api.pins.updatePin);
    const deletePin = useMutation(api.pins.deletePin);

    //designates place to put pin
    //if its clicking a pin - initiate pin linking
    function handlePinMouseDown(e: React.MouseEvent) {
        if (!pinToolActive) return;

        e.stopPropagation()
        if (e.target instanceof Element && (e.target.classList.contains('line') || (e.target.classList.contains('note')))) {
            return;
        } else if (e.target instanceof Element && (e.target.classList.contains('pin'))) {
            if (linking) {
                const dataAttribute = e.target.getAttribute('data-id') as Id<"pins">
                setLinkingPins([...linkingPins?.slice(0, 1), dataAttribute])
                return;
            } else {
                console.log("pinning start")
                const dataAttribute = e.target.getAttribute('data-id') as Id<"pins">
                setLinkingPins([dataAttribute, ...linkingPins?.slice(1)])
                setLinking(true);
                return;
            }
        } else {
            setLinking(false);
            const canvasRect = e.currentTarget.getBoundingClientRect();

            const relativeX = e.clientX - canvasRect.left;
            const relativeY = e.clientY - canvasRect.top;

            const scaledX = relativeX / zoom;
            const scaledY = relativeY / zoom;

            setStartPos({ x: scaledX, y: scaledY });
        }
    }

    //maybe a cheeky animation to show the current spot of the dragged pin?
    function handlePinMouseMove(e: React.MouseEvent) {
        if (!pinToolActive) return;

    }

    //places pin in original place 
    //or if pin linking, links two pins together
    async function handlePinMouseUp() {
        if (!pinToolActive) return;
        //if linking was active, somehow identify both pins in question and update the db for rewrite
        //else, just post the pin to the screen
        if (linking && linkingPins?.length === 2 && linkingPins[0] !== linkingPins[1] && linkingPins[1] !== null) {
            await connectTwoPins({
                pinOneId: linkingPins[0] as Id<"pins">,
                pinTwoId: linkingPins[1] as Id<"pins">
            })
            setLinking(false);
            setCurrentPos(null);
            setLinkingPins(new Array(2).fill(null))
        } else if (startPos) {
            await createNewPin({
                userId: userId,
                boardId: boardId,
                x: startPos.x,
                y: startPos.y,
                zIndex: 1
            })
        }
        setStartPos(null);
        setCurrentPos(null);
    }

    function handlePinDragStart(e: React.DragEvent) {
        e.stopPropagation()
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

    function handlePinDragMove(e: React.DragEvent, note: Doc<"pins">) {
        e.preventDefault()
        e.stopPropagation()
        if (!initialDragPos) return;

        //prevent odd release that sets x and y to 0
        if (e.clientX === 0 || e.clientY === 0) return;

        const deltaX = e.clientX - initialDragPos.x;
        const deltaY = e.clientY - initialDragPos.y;

        const newX = note.x + deltaX / zoom;
        const newY = note.y + deltaY / zoom;

        setCurrentPos({ id: note._id, x: newX, y: newY });
    }

    async function handlePinDragEnd(e: React.DragEvent, pin: Doc<"pins">) {
        if (currentPinPos) {
            await updatePin({
                pinId: pin._id,
                userId: userId,
                boardId: boardId,
                x: currentPinPos.x,
                y: currentPinPos.y,
                zIndex: 1,
            })
        }
        setInitialDragPos(null);
        setCurrentPos(null);
    }

    //hacky garbage i hate it
    async function pinKeyDown(e: React.KeyboardEvent, pin: Doc<"pins">) {
        if (e.key === "Delete") {
            e.preventDefault();

            // Record the current scroll positions
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            await deletePin({ pinId: pin._id });
            const focusDiv = document.getElementById("focusDiv");
            if (focusDiv) {
                focusDiv.focus();
            }

            // Restore the scroll positions
            window.scrollTo(scrollX, scrollY);
        }
    }

    return {
        handlePinMouseDown,
        handlePinMouseMove,
        handlePinMouseUp,
        handlePinDragStart,
        handlePinDragMove,
        handlePinDragEnd,
        pinKeyDown,
        currentPinPos
    }

}