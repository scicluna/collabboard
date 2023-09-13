"use client"

import { useDebounce } from "@/utils/debounce"
import { ReactNode, useRef, useState } from "react"



type ResizeWrappeProps = {
    children: ReactNode
    onUpdate: (newWidth: number, newHeight: number) => void;
}
type ResizingDirection = "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function ResizeWrapper({ children, onUpdate }: ResizeWrappeProps) {
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<null | ResizingDirection>(null);
    const [initialDimensions, setInitialDimensions] = useState<{ width: number; height: number; left: number; top: number } | null>(null);
    const [initialMousePos, setInitialMousePos] = useState<{ x: number; y: number } | null>(null);

    const childRef = useRef<HTMLDivElement>(null)

    const debouncedUpdate = useDebounce(onUpdate, 500)

    function handleResizeStart(e: React.MouseEvent, direction: ResizingDirection) {
        e.preventDefault();
        setIsResizing(true);
        setInitialMousePos({ x: e.clientX, y: e.clientY });
        setResizeDirection(direction);

        if (childRef.current) {
            const rect = childRef.current.getBoundingClientRect();
            setInitialDimensions({
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top
            });
        }
    }

    function handleResizeMove(e: React.MouseEvent) {
        if (isResizing && debouncedUpdate && initialMousePos && initialDimensions) {
            const deltaX = e.clientX - initialMousePos.x;
            const deltaY = e.clientY - initialMousePos.y;

            let width = initialDimensions.width
            let height = initialDimensions.height
            let x = initialDimensions.left
            let y = initialDimensions.top

            switch (resizeDirection) {
                case "left":
                    width -= deltaX;
                    x += deltaX;
                    break;
                case "right":
                    width += deltaX;
                    break;
                case "top":
                    height -= deltaY;
                    y += deltaY;
                    break;
                case "bottom":
                    height += deltaY;
                    break;
                case "top-left":
                    width -= deltaX;
                    x += deltaX;
                    height -= deltaY;
                    y += deltaY;
                    break;
                case "top-right":
                    width += deltaX;
                    height -= deltaY;
                    y += deltaY;
                    break;
                case "bottom-left":
                    width -= deltaX;
                    y += deltaX;
                    height += deltaY;
                    break;
                case "bottom-right":
                    width += deltaX;
                    height += deltaY;
                    break;
                default:
                    return;
            }

            setInitialMousePos({ x: e.clientX, y: e.clientY }); // update for continuous resizing
            debouncedUpdate(width, height)
        }
    }

    function handleResizeEnd() {
        setIsResizing(false);
        setResizeDirection(null);
    }

    return (
        <div>
            <div ref={childRef}>
                {children}
            </div>
            <AllHandles handleResizeStart={handleResizeStart} handleResizeMove={handleResizeMove} handleResizeEnd={handleResizeEnd} />
        </div>
    )

}

function ResizeHandle({ direction }: { direction: ResizingDirection }) {
    let cssResize: string = `absolute bg-black w-4 h-4  transform`;
    switch (direction) {
        case "left": {
            cssResize += ` -left-3 top-1/2 -translate-y-1/2 cursor-ew-resize`;
            break;
        }
        case "right": {
            cssResize += ` -right-3 top-1/2 -translate-y-1/2 cursor-ew-resize`;
            break;
        }
        case "top": {
            cssResize += ` left-1/2 -top-3 -translate-x-1/2 cursor-ns-resize`;
            break;
        }
        case "bottom": {
            cssResize += ` left-1/2 -bottom-3 -translate-x-1/2 cursor-ns-resize`;
            break;
        }
        case "top-left": {
            cssResize += ` -left-3 -top-3 cursor-nwse-resize`;
            break;
        }
        case "top-right": {
            cssResize += ` -right-3 -top-3 cursor-nesw-resize`;
            break;
        }
        case "bottom-left": {
            cssResize += ` -left-3 -bottom-3 cursor-nesw-resize`;
            break;
        }
        case "bottom-right": {
            cssResize += ` -right-3 -bottom-3 cursor-nwse-resize`;
            break;
        }
        default: return "";
    }

    return (
        <div className={cssResize} />
    );
}

type HandlesProps = {
    handleResizeStart: (e: React.MouseEvent, direction: ResizingDirection) => void
    handleResizeMove: (e: React.MouseEvent) => void
    handleResizeEnd: () => void
}

export function AllHandles({ handleResizeStart, handleResizeMove, handleResizeEnd }: HandlesProps) {
    const directions: ResizingDirection[] = ["left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"]
    return (
        <>
            {directions.map(direction => (
                <ResizeHandle key={direction} direction={direction} />
            ))}
        </>
    )
}