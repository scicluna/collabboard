"use client"
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

type useNoteUpdatingProps = {
    zoom: number,
}

function useNoteUpdating({ zoom }: useNoteUpdatingProps) {
    const updateNote = useMutation(api.notes.updateNote)
    const deleteNote = useMutation(api.notes.deleteNote)
    const [initialDragPos, setInitialDragPos] = useState<{ x: number, y: number } | null>(null);
    const [currentPosition, setCurrentPosition] = useState<{ noteId: string, width: number, height: number, x: number, y: number } | null>(null);

    async function noteKeyDown(e: React.KeyboardEvent, note: Doc<"notes">) {
        if (e.key === "Delete") {
            e.preventDefault()
            await deleteNote({ noteId: note._id })
        }
    }

    function updateNoteText(textContent: string, note: Doc<"notes">) {
        updateNote({
            noteId: note._id,
            userId: note.userId,
            boardId: note.boardId,
            x: note.x,
            y: note.y,
            width: note.width,
            height: note.height,
            fontSize: note.fontSize,
            zIndex: note.zIndex,
            text: textContent
        })
    }

    function handleNoteDragStart(e: React.DragEvent) {
        var img = document.createElement("img");
        img.style.backgroundColor = "red";
        img.style.position = "absolute"; img.style.top = "0px"; img.style.right = "0px";
        document.body.appendChild(img);
        e.dataTransfer.setDragImage(img, 0, 0);
        setInitialDragPos({
            x: e.clientX,
            y: e.clientY
        });
    }

    function handleNoteDrag(e: React.DragEvent, note: Doc<"notes">) {
        e.preventDefault()
        if (!initialDragPos) return;

        const deltaX = e.clientX - initialDragPos.x;
        const deltaY = e.clientY - initialDragPos.y;

        const newX = note.x + deltaX / zoom;
        const newY = note.y + deltaY / zoom;

        setCurrentPosition({ noteId: note._id, width: note.width, height: note.height, x: newX, y: newY });
    }

    async function handleNoteDragEnd(e: React.DragEvent, note: Doc<"notes">) {
        e.preventDefault()
        if (!initialDragPos || !currentPosition) return;


        const deltaX = e.clientX - initialDragPos.x;
        const deltaY = e.clientY - initialDragPos.y;

        const newX = note.x + deltaX / zoom;
        const newY = note.y + deltaY / zoom;

        await updateNote({
            noteId: note._id,
            userId: note.userId,
            boardId: note.boardId,
            width: note.width,
            height: note.height,
            fontSize: note.fontSize,
            zIndex: note.zIndex,
            text: note.text,
            x: newX,
            y: newY
        });

        setInitialDragPos(null);
        setCurrentPosition(null);
    }

    return {
        noteKeyDown,
        updateNoteText,
        handleNoteDragStart,
        handleNoteDrag,
        currentPosition,
        handleNoteDragEnd,
    }
}

export default useNoteUpdating;