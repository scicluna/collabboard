"use client"

import { Doc, Id } from "@/convex/_generated/dataModel"
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react"

type ResizeWrappeProps = {
    children: ReactNode
    onUpdate: (doc: Doc<any>) => void;
    doc: Doc<any>
    moving: {
        noteId: string;
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    setFocused: Dispatch<SetStateAction<boolean>>
    focused: boolean
}

type ResizingDirection = "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function ResizeWrapper({ children, onUpdate, doc, moving, setFocused, focused }: ResizeWrappeProps) {
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<null | ResizingDirection>(null);
    const [initialMousePos, setInitialMousePos] = useState<{ x: number; y: number } | null>(null);

    const resizableRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let updatedObject = doc
        function handleMouseMove(e: MouseEvent) {
            if (!isResizing || !initialMousePos || !resizeDirection) return;

            const deltaX = e.clientX - initialMousePos.x;
            const deltaY = e.clientY - initialMousePos.y;

            let width = updatedObject.width
            let height = updatedObject.height
            let x = updatedObject.x
            let y = updatedObject.y

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
                    x += deltaX;
                    height += deltaY;
                    break;
                case "bottom-right":
                    width += deltaX;
                    height += deltaY;
                    break;
                default:
                    return;
            }

            updatedObject.width = width
            updatedObject.height = height
            updatedObject.x = x
            updatedObject.y = y

            setInitialMousePos({ x: e.clientX, y: e.clientY }); // update for continuous resizing
        }

        function handleMouseUp() {
            if (isResizing) {
                onUpdate(doc)
            }
            setIsResizing(false);
            setResizeDirection(null);
            setInitialMousePos(null);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing, initialMousePos, resizeDirection]);

    function resize(e: React.MouseEvent, direction: ResizingDirection) {
        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(direction);
        setInitialMousePos({ x: e.clientX, y: e.clientY });
    }

    function handleBlur(e: React.FocusEvent) {
        if (isResizing) return
        setTimeout(() => {
            setFocused(false);
        }, 0);
    }

    return (
        <>
            <div ref={resizableRef} className={`absolute note ${moving?.noteId === doc._id && 'invisible'} outline outline-black  focus:outline-indigo-400 focus:outline-4`}
                style={{ width: `${doc.width}px`, height: `${doc.height}px`, top: `${doc.y}px`, left: `${doc.x}px` }}
                onClick={e => setFocused(true)}
                onBlur={handleBlur}>
                {children}
                {focused && <AllHandles handleResizeStart={resize} />}
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