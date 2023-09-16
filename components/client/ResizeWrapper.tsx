"use client"

import { Doc } from "@/convex/_generated/dataModel"
import { useResizing } from "@/hooks/useResizing"
import { Dispatch, ReactNode, SetStateAction, useRef } from "react"

type ResizeWrappeProps = {
    children: ReactNode
    onUpdate: (doc: Doc<any>) => void;
    doc: Doc<any>
    moving: {
        id: string;
        x: number;
        y: number;
        width?: number;
        height?: number;
    } | null;
    setFocused: Dispatch<SetStateAction<boolean>>
    focused: boolean
}

export type ResizingDirection = "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function ResizeWrapper({ children, onUpdate, doc, moving, setFocused, focused }: ResizeWrappeProps) {
    const { isResizing, resize } = useResizing({ doc, onUpdate });
    const resizableRef = useRef(null);

    function handleBlur() {
        if (isResizing) return
        setTimeout(() => {
            setFocused(false);
        }, 0);
    }

    return (
        <div ref={resizableRef}
            className={`absolute ${moving?.id === doc._id && 'invisible'} 
                outline outline-black rounded-md -z-10
                ${focused && 'outline-indigo-400 outline-4'}
                ${isResizing && 'noSelect'}`}
            style={{ width: `${doc.width}px`, height: `${doc.height}px`, top: `${doc.y}px`, left: `${doc.x}px` }}
            onClick={e => setFocused(true)}
            onBlur={handleBlur}>
            {children}
            {focused && <AllHandles handleResizeStart={resize} />}
        </div >
    )
}

//individual resize handle
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

//all resize handles
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