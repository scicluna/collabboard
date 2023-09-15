"use client"

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type useNotesProps = {
    noteToolActive: boolean
    userId: string
    boardId: string
    zoom: number
}

function useNoteTool({ noteToolActive, userId, boardId, zoom }: useNotesProps) {
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [currentBox, setCurrentBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [drawingNote, setDrawingNote] = useState(false)
    const createNewNote = useMutation(api.notes.createNewNote);

    function handleNoteMouseDown(e: React.MouseEvent) {
        if (!noteToolActive) return;

        // Determine if the click target or any of its parent elements has the class 'note'
        let target: any = e.target;
        while (target != null) {
            if (target.classList && target.classList.contains('note') || target.classList.contains('pin') || target.classList.contains('line')) {
                // If it's an input or textarea, focus on it
                if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
                    target.focus();
                }
                return; // Exit the function early
            }
            target = target.parentNode;
        }

        // If we reached here, then it's a background click. Proceed with the drawing action.
        setStartPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        setDrawingNote(true);
    }

    function handleNoteMouseMove(e: React.MouseEvent) {
        if (!noteToolActive || !startPos || !drawingNote) return;

        const canvasRect = e.currentTarget.getBoundingClientRect();

        const relativeX = e.clientX - canvasRect.left + e.currentTarget.scrollLeft;
        const relativeY = e.clientY - canvasRect.top + e.currentTarget.scrollTop;

        const scaledX = relativeX / zoom;
        const scaledY = relativeY / zoom;

        // The rest of the logic remains unchanged...
        const width = Math.abs(scaledX - startPos.x);
        const height = Math.abs(scaledY - startPos.y);

        const x = scaledX > startPos.x ? startPos.x : startPos.x - width;
        const y = scaledY > startPos.y ? startPos.y : startPos.y - height;

        setCurrentBox({
            x: x,
            y: y,
            width,
            height
        });
    }

    async function handleNoteMouseUp() {
        if (!noteToolActive || !currentBox || !drawingNote) {
            setCurrentBox(null)
            setStartPos(null)
            setDrawingNote(false)
            return
        };

        // Send the currentBox data to the database.
        await createNewNote({
            userId: userId,
            boardId: boardId,
            x: currentBox.x,
            y: currentBox.y,
            width: currentBox.width,
            height: currentBox.height,
            fontSize: 20,
            zIndex: 1,
            text: "New Note"
        })

        setStartPos(null);
        setCurrentBox(null);
        setDrawingNote(prev => false);
    }

    return {
        handleNoteMouseDown,
        handleNoteMouseMove,
        handleNoteMouseUp,
        currentBox
    }
}

export default useNoteTool