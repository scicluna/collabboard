"use client"

import { useState } from "react"

type usePinToolProps = {
    pinToolActive: boolean
    zoom: number
}

function usePinTool({ pinToolActive, zoom }: usePinToolProps) {
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [currentPinPos, setCurrentPos] = useState<{ x: number, y: number } | null>(null);
    const [linking, setLinking] = useState(false);
    const [linkingPins, setLinkingPins] = useState<string[]>(new Array(2).fill(null))

    //designates place to put pin
    //if its clicking a pin - initiate pin linking
    function handlePinMouseDown(e: React.MouseEvent) {
        if (!pinToolActive) return;

        if (e.target instanceof Element && (e.target.classList.contains('line') || (e.target.classList.contains('note')))) {
            return;
        } else if (e.target instanceof Element && (e.target.classList.contains('pin'))) {
            //somehow record pin id here - maybe as a data-tag on the html?
            setLinkingPins(["firstid", ...linkingPins?.slice(1)])
            setLinking(true);
        }
        const canvasRect = e.currentTarget.getBoundingClientRect();

        const relativeX = e.clientX - canvasRect.left;
        const relativeY = e.clientY - canvasRect.top;

        const scaledX = relativeX / zoom;
        const scaledY = relativeY / zoom;

        setStartPos({ x: scaledX, y: scaledY });
    }

    //maybe a cheeky animation to show the current spot of the dragged pin?
    function handlePinMouseMove(e: React.MouseEvent) {
        if (!pinToolActive || !linking || !startPos) return;

        if (e.target instanceof Element && (e.target.classList.contains('pin')) && linkingPins) {
            setLinkingPins([...linkingPins?.slice(0, 1), "secondid"])
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
        if (linking && linkingPins?.length === 2) {
            // updatePinConnections({

            // })
        } else if (startPos) {
            // createNewPin({

            // })
        }
        setLinking(false);
        setStartPos(null);
        setCurrentPos(null);
    }

    return {
        handlePinMouseDown,
        handlePinMouseMove,
        handlePinMouseUp,
        currentPinPos
    }

}