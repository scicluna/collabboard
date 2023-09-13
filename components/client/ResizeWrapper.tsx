"use client"

import { Id } from "@/convex/_generated/dataModel"
import { useDebounce } from "@/utils/debounce"
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react"



type ResizeWrappeProps = {
    children: ReactNode
    id: Id<any>
    onUpdate: (id: Id<any>, newWidth: number, newHeight: number) => void;
    height: number
    width: number
    x: number
    y: number
    zoom: number
    currentPosition: {
        noteId: string;
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    isResizing: boolean
    setIsResizing: Dispatch<SetStateAction<boolean>>
}
type ResizingDirection = "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function ResizeWrapper({ children, onUpdate, id, height, width, x, y, zoom, currentPosition, isResizing, setIsResizing }: ResizeWrappeProps) {
    const [dimensions, setDimensions] = useState<{ width: number; height: number; left: number; top: number } | null>({ width: width, height: height, left: x, top: y });
    const [initialMousePos, setInitialMousePos] = useState<{ x: number; y: number } | null>(null);

    const resizableRef = useRef<HTMLDivElement | null>(null);

    const debouncedUpdate = useDebounce(onUpdate, 500)

    useEffect(() => {
        function handleResizeMove(e: MouseEvent) {
            console.log(isResizing)
            if (isResizing && debouncedUpdate && initialMousePos && dimensions) {
                const canvasRect = resizableRef.current?.getBoundingClientRect();
                if (!canvasRect) return; // Guard against null

                const relativeX = e.clientX - canvasRect.left + window.scrollX;
                const relativeY = e.clientY - canvasRect.top + window.scrollY;

                const scaledX = relativeX / zoom;
                const scaledY = relativeY / zoom;

                // The rest of the logic remains unchanged...
                const width = Math.abs(scaledX - initialMousePos.x);
                const height = Math.abs(scaledY - initialMousePos.y);

                const x = scaledX > initialMousePos.x ? initialMousePos.x : initialMousePos.x - width;
                const y = scaledY > initialMousePos.y ? initialMousePos.y : initialMousePos.y - height;

                setDimensions({
                    left: x,
                    top: y,
                    width,
                    height
                });

                setInitialMousePos({ x: e.clientX, y: e.clientY }); // update for continuous resizing

                debouncedUpdate(id, width, height)
            }
        }

        function handleResizeEnd() {
            console.log(isResizing)
            setIsResizing(false);
            setDimensions({ width: width, height: height, left: x, top: y });
        }
        console.log(isResizing)
        if (isResizing) {
            document.addEventListener('mousemove', handleResizeMove);
            document.addEventListener('mouseup', handleResizeEnd)
            document.addEventListener('mouseleave', handleResizeEnd)
        } else {
            document.removeEventListener('mousemove', handleResizeMove);
            document.removeEventListener('mouseup', handleResizeEnd);
            document.removeEventListener('mouseleave', handleResizeEnd)
        }
    }, [isResizing])

    function handleResizeStart(e: React.MouseEvent, direction: ResizingDirection) {
        setInitialMousePos({ x: e.clientX, y: e.clientY });
        setDimensions({
            width: width,
            height: height,
            left: x,
            top: y
        });
        setIsResizing(true);
    }

    return (
        <>
            <div ref={resizableRef} className={`absolute note`}
                style={{ width: `${width}px`, height: `${height}px`, top: `${y}px`, left: `${x}px` }}>
                {children}
                <AllHandles handleResizeStart={handleResizeStart} />
            </div>
        </>
    )
}

type ResizeHandleProps = {
    direction: string
    handleResizeStart: (e: React.MouseEvent, direction: ResizingDirection) => void
}

function ResizeHandle({ direction, handleResizeStart }: ResizeHandleProps) {
    let cssResize: string = `absolute bg-black w-4 h-4  transform note`;
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
        <div className={cssResize}
            onMouseDown={e => handleResizeStart(e, direction)}
        />
    );
}

type HandlesProps = {
    handleResizeStart: (e: React.MouseEvent, direction: ResizingDirection) => void
}

export function AllHandles({ handleResizeStart }: HandlesProps) {
    const directions: ResizingDirection[] = ["left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"]
    return (
        <>
            {directions.map(direction => (
                <ResizeHandle
                    key={direction} direction={direction}
                    handleResizeStart={handleResizeStart}
                />
            ))}
        </>
    )
}