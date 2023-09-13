"use client"

import { Id } from "@/convex/_generated/dataModel"
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react"

type DimensionProps = {
    _id: Id<any>;
    height: number;
    width: number;
    x: number;
    y: number;
};

type ResizeWrappeProps = {
    children: ReactNode
    onUpdate: (id: Id<any>, newWidth: number, newHeight: number) => void;
    object: DimensionProps & Record<string, any>;
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

export default function ResizeWrapper({ children, onUpdate, object, moving, setFocused, focused }: ResizeWrappeProps) {
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<null | ResizingDirection>(null);
    const [initialMousePos, setInitialMousePos] = useState<{ x: number; y: number } | null>(null);

    const resizableRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let updatedObject = object
        function handleMouseMove(e: MouseEvent) {
            if (!isResizing || !initialMousePos || !resizeDirection) return;

            const deltaX = e.clientX - initialMousePos.x;
            const deltaY = e.clientY - initialMousePos.y;

            let width = updatedObject.width
            let height = updatedObject.height
            let left = updatedObject.x
            let top = updatedObject.y

            switch (resizeDirection) {
                case "left":
                    width -= deltaX;
                    left += deltaX;
                    break;
                case "right":
                    width += deltaX;
                    break;
                case "top":
                    height -= deltaY;
                    top += deltaY;
                    break;
                case "bottom":
                    height += deltaY;
                    break;
                case "top-left":
                    width -= deltaX;
                    left += deltaX;
                    height -= deltaY;
                    top += deltaY;
                    break;
                case "top-right":
                    width += deltaX;
                    height -= deltaY;
                    top += deltaY;
                    break;
                case "bottom-left":
                    width -= deltaX;
                    left += deltaX;
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
            updatedObject.left = left
            updatedObject.top = top
            setInitialMousePos({ x: e.clientX, y: e.clientY }); // update for continuous resizing
        }

        function handleMouseUp() {
            setIsResizing(false);
            setResizeDirection(null);
            setInitialMousePos(null);
            onUpdate(object._id, object.width, object.height)
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
            <div ref={resizableRef} className={`absolute note ${moving?.noteId === object._id && 'invisible'} outline outline-black  focus:outline-indigo-400 focus:outline-4`}
                style={{ width: `${object.width}px`, height: `${object.height}px`, top: `${object.y}px`, left: `${object.x}px` }}
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