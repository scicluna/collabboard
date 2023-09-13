"use client"
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { computeBoundingBox } from "@/utils/computebindingbox";
import { useMutation } from "convex/react";
import { useState } from "react";

type useLineToolProps = {
    lineToolActive: boolean
    userId: string,
    boardId: string
}

export function useLineTool({ lineToolActive, userId, boardId }: useLineToolProps) {
    const [currentPath, setCurrentPath] = useState("");
    const [points, setPoints] = useState<Array<[number, number]>>([]);

    const newLineGenerator = useMutation(api.lines.createNewLine)
    const updateLine = useMutation(api.lines.updateLine)
    const deleteLine = useMutation(api.lines.deleteNote)

    const handleLineMouseDown = (e: React.MouseEvent) => {
        if (!lineToolActive) return;
        const { offsetX, offsetY } = e.nativeEvent;
        setPoints([[offsetX, offsetY]]);
        setCurrentPath(`M ${offsetX} ${offsetY}`);
    };

    const handleLineMouseMove = (e: React.MouseEvent) => {
        if (!currentPath || !points || !lineToolActive) return;
        const { offsetX, offsetY } = e.nativeEvent;
        setPoints(prev => [...prev, [offsetX, offsetY]]);

        if (points.length > 3) {
            const [start, ...rest] = points;
            const mid = rest[Math.floor(rest.length / 2)];
            const end = rest[rest.length - 1];

            const controlPoint1 = [(start[0] + mid[0]) / 2, (start[1] + mid[1]) / 2];
            const controlPoint2 = [(end[0] + mid[0]) / 2, (end[1] + mid[1]) / 2];

            const newPathSegment = `C ${controlPoint1[0]} ${controlPoint1[1]}, ${controlPoint2[0]} ${controlPoint2[1]}, ${end[0]} ${end[1]}`;
            setCurrentPath(prev => `${prev} ${newPathSegment}`);

            // Retain only the last two points and discard the others
            setPoints([rest[rest.length - 2], rest[rest.length - 1]]);
        }
    };

    const handleLineMouseUp = async () => {
        if (!currentPath || !points || !lineToolActive) return
        const { x, y, width, height } = computeBoundingBox(currentPath)
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
        setCurrentPath("");
        setPoints([]);
    };

    function handleLineResize(line: Doc<"lines">) {
        updateLine({
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
    async function lineKeyDown(e: React.KeyboardEvent, line: Doc<"lines">) {
        if (e.key === "Delete") {
            e.preventDefault()
            await deleteLine({ lineId: line._id })
        }
    }


    return {
        handleLineMouseDown,
        handleLineMouseMove,
        handleLineMouseUp,
        handleLineResize,
        lineKeyDown,
        currentPath
    }
}
