"use client"
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { computeBoundingBox } from "@/utils/computebindingbox";
import { scaledMouse } from "@/utils/scaledmouse";
import { useMutation } from "convex/react";
import { useState } from "react";

type useLineToolProps = {
    lineToolActive: boolean
    userId: string,
    boardId: string
    zoom: number
}

export function useLineTool({ lineToolActive, userId, boardId, zoom }: useLineToolProps) {
    const [currentPath, setCurrentPath] = useState("");
    const [points, setPoints] = useState<Array<[number, number]>>([]);

    const newLineGenerator = useMutation(api.lines.createNewLine)
    const updateLine = useMutation(api.lines.updateLine)
    const deleteLine = useMutation(api.lines.deleteLine)

    const handleLineMouseDown = (e: React.MouseEvent) => {
        if (!lineToolActive) return;
        if (e.target instanceof Element && ((e.target.classList.contains('line') || (e.target.classList.contains('note')) || (e.target.classList.contains('image'))))) {
            return;  // Do nothing if a line was clicked
        }

        const { scaledX, scaledY } = scaledMouse(e, zoom)

        if (scaledX && scaledY) {
            setCurrentPath(`M ${scaledX} ${scaledY}`);
        }

    };

    const handleLineMouseMove = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!currentPath || !points || !lineToolActive) return;

        const { scaledX, scaledY } = scaledMouse(e, zoom);

        setPoints(prev => [...prev, [scaledX!, scaledY!]]);

        if (points.length > 3) {
            const lastThree = points.slice(-3); // get the last three points
            const [start, mid, end] = lastThree;

            const controlPoint1 = [mid[0], mid[1]];
            const controlPoint2 = [(end[0] + mid[0]) / 2, (end[1] + mid[1]) / 2];

            const newPathSegment = `C ${controlPoint1[0]} ${controlPoint1[1]}, ${controlPoint2[0]} ${controlPoint2[1]}, ${end[0]} ${end[1]}`;
            setCurrentPath(prev => `${prev} ${newPathSegment}`);

            setPoints([mid, end]);
        }
    };

    const handleLineMouseUp = async () => {
        if (!currentPath || !points || !lineToolActive) return
        const { x, y, width, height } = computeBoundingBox(currentPath)
        if (width > 0 && height > 0) {
            await newLineGenerator({
                userId: userId,
                boardId: boardId,
                x: x,
                y: y,
                width: width,
                height: height,
                path: currentPath,
                zIndex: 1,
                strokeColor: 'black'
            })
        }
        setCurrentPath("");
        setPoints([]);
    };

    async function handleLineDrag(line: Doc<"lines">, newPath: string) {
        await updateLine({
            lineId: line._id,
            userId: line.userId,
            boardId: line.boardId,
            x: line.x,
            y: line.y,
            width: line.width,
            height: line.height,
            path: newPath,
            zIndex: line.zIndex,
            strokeColor: line.strokeColor
        })
    }

    async function handleLineResize(line: Doc<"lines">) {
        await updateLine({
            lineId: line._id,
            userId: line.userId,
            boardId: line.boardId,
            x: line.x,
            y: line.y,
            width: line.width,
            height: line.height,
            path: line.path,
            zIndex: line.zIndex,
            strokeColor: line.strokeColor
        })

    }

    //hacky garbage i hate it
    async function lineKeyDown(e: React.KeyboardEvent, line: Doc<"lines">) {
        if (e.key === "Delete") {
            e.preventDefault();

            // Record the current scroll positions
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            await deleteLine({ lineId: line._id });
            const focusDiv = document.getElementById("focusDiv");
            if (focusDiv) {
                focusDiv.focus();
            }

            // Restore the scroll positions
            window.scrollTo(scrollX, scrollY);
        }
    }


    return {
        handleLineMouseDown,
        handleLineMouseMove,
        handleLineMouseUp,
        handleLineResize,
        lineKeyDown,
        handleLineDrag,
        currentPath
    }
}
