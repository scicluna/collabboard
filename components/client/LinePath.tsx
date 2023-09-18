import { Doc } from "@/convex/_generated/dataModel"
import { useEffect, useState } from "react"


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
    handleLineDrag: (line: Doc<"lines">, newPath: string) => Promise<void>
}

export default function LinePath({ line, handleLineResize, moving, lineKeyDown, handleLineDrag }: LinePathProps) {
    const [focused, setFocused] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [currentD, setCurrentD] = useState(line.path)

    const handleMouseDown = (e: React.MouseEvent) => {
        setStartPos({
            x: e.clientX,
            y: e.clientY
        });
    };

    function adjustPathD(d: string, dx: number, dy: number) {
        return d.replace(/([MC])\s*(\d+\.?\d*)\s+(\d+\.?\d*)(?:,\s*(\d+\.?\d*)\s+(\d+\.?\d*)\s*,\s*(\d+\.?\d*)\s+(\d+\.?\d*))?/g,
            (_, command, x1, y1, x2, y2, x3, y3) => {
                if (command === 'M') {
                    return `${command} ${parseFloat(x1) + dx} ${parseFloat(y1) + dy}`;
                }
                if (command === 'C') {
                    return `${command} ${parseFloat(x1) + dx} ${parseFloat(y1) + dy},${parseFloat(x2) + dx} ${parseFloat(y2) + dy},${parseFloat(x3) + dx} ${parseFloat(y3) + dy}`;
                }
                return "";
            }
        );
    }


    function handleMouseMove(e: MouseEvent) {
        if (!startPos) return;

        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        const newPath = adjustPathD(line.path, deltaX, deltaY)
        setCurrentD(newPath)
    };

    const handleMouseUp = async (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!startPos) return;

        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        const newPath = adjustPathD(line.path, deltaX, deltaY)

        await handleLineDrag(line, newPath);

        setStartPos(null);
        setDragging(false);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, startPos]);

    return (
        <path
            d={currentD}
            stroke={focused ? "purple" : line.strokeColor}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            style={{ zIndex: `${line.zIndex}` }}
            className="pointer-events-auto line"
            onClick={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDownCapture={e => lineKeyDown(e, line)}
            tabIndex={0}
            onMouseDown={handleMouseDown}
        />
    );
}
