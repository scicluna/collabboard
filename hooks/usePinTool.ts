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
    maxZIndex: number
}

export function usePinTool({ pinToolActive, zoom, userId, boardId, maxZIndex }: usePinToolProps) {
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [initialDragPos, setInitialDragPos] = useState<{ x: number, y: number } | null>(null)
    const [currentPinPos, setCurrentPos] = useState<{ id: string, x: number, y: number, height: number, width: number } | null>(null);
    const [linking, setLinking] = useState(false);
    const [linkingPins, setLinkingPins] = useState<string[]>(new Array(2).fill(null))
    const [dragging, setDragging] = useState(false)

    const createNewPin = useMutation(api.pins.createNewPin);
    const connectTwoPins = useMutation(api.pins.linkTwoPins);
    const updatePin = useMutation(api.pins.updatePin);
    const deletePin = useMutation(api.pins.deletePin);

    //designates place to put pin
    //if its clicking a pin - initiate pin linking
    function handlePinMouseDown(e: React.MouseEvent) {
        if (!pinToolActive) return;

        e.stopPropagation()
        if (e.target instanceof Element && (e.target.classList.contains('line') || (e.target.classList.contains('note')) || (e.target.classList.contains('image')))) {
            return;
        } else if (e.target instanceof Element && (e.target.classList.contains('pin'))) {
            if (linking) {
                const dataAttribute = e.target.getAttribute('data-id') as Id<"pins">
                setLinkingPins([...linkingPins?.slice(0, 1), dataAttribute])
                return;
            } else {
                const dataAttribute = e.target.getAttribute('data-id') as Id<"pins">
                setLinkingPins([dataAttribute, ...linkingPins?.slice(1)])
                setLinking(true);
                return;
            }
        } else {
            //just create a pin
            const canvasRect = e.currentTarget.getBoundingClientRect();

            const relativeX = e.clientX - canvasRect.left;
            const relativeY = e.clientY - canvasRect.top;

            const scaledX = (relativeX - (50 * zoom)) / zoom;
            const scaledY = (relativeY - (50 * zoom)) / zoom;



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
        if (linking && linkingPins?.length === 2 && linkingPins[0] !== linkingPins[1] && linkingPins[1] !== null) {
            //if we were dragging, disregard and reset the linking
            if (!dragging) {
                await connectTwoPins({
                    pinOneId: linkingPins[0] as Id<"pins">,
                    pinTwoId: linkingPins[1] as Id<"pins">
                })
            }
            setLinking(false);
            setLinkingPins(new Array(2).fill(null))

            //if we have a start pos(make new pin)
        } else if (startPos) {
            await createNewPin({
                userId: userId,
                boardId: boardId,
                x: startPos.x,
                y: startPos.y,
                zIndex: maxZIndex
            })
            setStartPos(null)
        }
    }

    function handlePinDragStart(e: React.DragEvent) {
        setDragging(true);
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

    function handlePinDragMove(e: React.DragEvent, pin: Doc<"pins">) {
        e.preventDefault()
        e.stopPropagation()
        if (!initialDragPos) return;

        //prevent odd release that sets x and y to 0
        if (e.clientX === 0 || e.clientY === 0) return;

        const deltaX = e.clientX - initialDragPos.x;
        const deltaY = e.clientY - initialDragPos.y;

        const startX = pin.x + (pin.width * zoom) / 2;
        const startY = pin.y + (pin.height * zoom) / 2; // Adjusted for center

        const newX = startX + deltaX / zoom;
        const newY = startY + deltaY / zoom;

        setCurrentPos({ id: pin._id, x: newX, y: newY, height: pin.height, width: pin.width });
    }

    async function handlePinDragEnd(e: React.DragEvent, pin: Doc<"pins">) {
        //if we dragged it any distance update the pin with the new location
        if (currentPinPos) {
            await updatePin({
                pinId: pin._id,
                userId: userId,
                boardId: boardId,
                x: currentPinPos.x,
                y: currentPinPos.y,
                width: pin.width,
                height: pin.height,
                zIndex: maxZIndex,
                connectedPins: pin.connectedPins
            })
        }
        //reset all states after a drag
        setInitialDragPos(null);
        setStartPos(null)
        setCurrentPos(null);
        setDragging(false);
        setLinkingPins(new Array(2).fill(null))
        setLinking(false);
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

    async function handlePinResize(pin: Doc<"pins">) {
        await updatePin({
            pinId: pin._id,
            userId: pin.userId,
            boardId: pin.boardId,
            x: pin.x,
            y: pin.y,
            height: pin.height,
            width: pin.width,
            zIndex: maxZIndex,
            connectedPins: pin.connectedPins
        })
    }

    const pinCursorLogic = pinToolActive ? 'crosshair' : 'default';

    return {
        handlePinMouseDown,
        handlePinMouseMove,
        handlePinMouseUp,
        handlePinDragStart,
        handlePinDragMove,
        handlePinDragEnd,
        pinKeyDown,
        handlePinResize,
        currentPinPos,
        pinCursorLogic
    }

}