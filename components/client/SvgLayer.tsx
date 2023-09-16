"use client"

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import LinePath from "./LinePath";
import { Doc } from "@/convex/_generated/dataModel";
import LinePreview from "./LinePreview";
import { useConnections } from "@/hooks/useConnections";

type SvgLayerProps = {
    boardId: string
    currentPosition: {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    currentPath: string
    handleLineResize: (line: Doc<"lines">) => void
    lineKeyDown: (e: React.KeyboardEvent, line: Doc<"lines">) => Promise<void>
    handleLineDrag: (line: Doc<"lines">, newPath: string) => Promise<void>
    pins: Doc<"pins">[] | undefined
}

export default function SvgLayer({ boardId, currentPosition, currentPath, handleLineResize, lineKeyDown, handleLineDrag, pins }: SvgLayerProps) {
    const lines = useQuery(api.lines.getLines, { boardId })
    const { getConnections, generateConnectionPath } = useConnections()
    console.log(pins)
    console.log("hi")

    return (
        <svg className="h-full w-full pointer-events-none absolute z-20"
            viewBox="0 0 2500 2250"
            preserveAspectRatio="xMidYMid meet"
            width="100%"
            height="100%"
        >
            <g>
                {pins && getConnections(pins).map(connection => generateConnectionPath(connection.pinOne, connection.pinTwo))}
            </g>
            {lines?.map(line => (
                <LinePath
                    line={line}
                    handleLineResize={handleLineResize}
                    moving={currentPosition}
                    lineKeyDown={lineKeyDown}
                    handleLineDrag={handleLineDrag}
                    key={line._id} />
            ))}
            <LinePreview currentPath={currentPath} />
        </svg>
    )
}