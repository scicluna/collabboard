import ResizeWrapper from "@/components/client/ResizeWrapper"
import { Doc } from "@/convex/_generated/dataModel"
import { useState } from "react"


type LinePathProps = {
    line: Doc<"lines">
    handleLineResize: (line: Doc<"lines">) => void
    moving: {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    lineKeyDown: (e: React.KeyboardEvent, line: Doc<"lines">) => Promise<void>
}

export default function LinePath({ line, handleLineResize, moving, lineKeyDown }: LinePathProps) {
    const [focused, setFocused] = useState(false)



    return (
        <path d={line.path} stroke={focused ? "purple" : line.strokeColor} fill="none" strokeWidth="10" strokeLinecap="round"
            style={{ zIndex: `${line.zIndex}px` }}
            className="pointer-events-auto"
            onClick={() => setFocused(true)}
            onMouseLeave={() => setFocused(false)}
        />
    )
}