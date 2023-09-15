"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { useState } from "react"

type usePinToolProps = {
    pinToolActive: boolean
    zoom: number
    userId: string
    boardId: string
}

export function usePinTool({ pinToolActive, zoom, userId, boardId }: usePinToolProps) {
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [currentPinPos, setCurrentPos] = useState<{ x: number, y: number } | null>(null);
    const [linking, setLinking] = useState(false);
    const [linkingPins, setLinkingPins] = useState<string[]>(new Array(2).fill(null))

    const createNewPin = useMutation(api.pins.createNewPin)
    const connectTwoPins = useMutation(api.pins.linkTwoPins)

    //designates place to put pin
    //if its clicking a pin - initiate pin linking
    function handlePinMouseDown(e: React.MouseEvent) {
        if (!pinToolActive) return;

        e.stopPropagation()
        console.log(e.target)
        if (e.target instanceof Element && (e.target.classList.contains('line') || (e.target.classList.contains('note')))) {
            return;
        } else if (e.target instanceof Element && (e.target.classList.contains('pin'))) {
            console.log("pinning start")
            const dataAttribute = e.target.getAttribute('data-id') as Id<"pins">
            setLinkingPins([dataAttribute, ...linkingPins?.slice(1)])
            setLinking(true);
            return;
        } else {
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

        if (e.target instanceof Element && (e.target.classList.contains('pin'))) {
            const dataAttribute = e.target.getAttribute('data-id') as Id<"pins">
            setLinkingPins([...linkingPins?.slice(0, 1), dataAttribute])
        }

        const canvasRect = e.currentTarget.getBoundingClientRect();

        const relativeX = e.clientX - canvasRect.left;
        const relativeY = e.clientY - canvasRect.top;

        const scaledX = relativeX / zoom;
        const scaledY = relativeY / zoom;

        setCurrentPos({ x: scaledX, y: scaledY });
    }

    //places pin in original place 
    //or if pin linking, links two pins together
    function handlePinMouseUp() {
        if (!pinToolActive || !startPos) return;

        //if linking was active, somehow identify both pins in question and update the db for rewrite
        //else, just post the pin to the screen
        if (linking && linkingPins?.length === 2 && linkingPins[0] !== linkingPins[1] && linkingPins[1] !== null) {
            connectTwoPins({
                pinOneId: linkingPins[0] as Id<"pins">,
                pinTwoId: linkingPins[1] as Id<"pins">
            })
            setLinking(false);
            setCurrentPos(null);
            setLinkingPins(new Array(2).fill(null))
        } else if (startPos) {
            createNewPin({
                userId: userId,
                boardId: boardId,
                x: startPos.x,
                y: startPos.y,
                zIndex: 1
            })
        }
        setStartPos(null);
    }

    return {
        handlePinMouseDown,
        handlePinMouseMove,
        handlePinMouseUp,
        currentPinPos
    }

}