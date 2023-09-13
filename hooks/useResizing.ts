"use client"

import { ResizingDirection } from "@/components/client/ResizeWrapper";
import { Doc } from "@/convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";

type ResizingProps = {
    doc: Doc<any>,
    onUpdate: (doc: Doc<any>) => void,
};

export function useResizing({ doc, onUpdate }: ResizingProps) {
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<null | ResizingDirection>(null);
    const [initialMousePos, setInitialMousePos] = useState<{ x: number; y: number } | null>(null);

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


    return {
        isResizing,
        resize,
    };
}