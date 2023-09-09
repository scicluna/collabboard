"use client"

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type useNotesProps = {
    noteToolActive: boolean
}

function useNoteTool({ noteToolActive }: useNotesProps) {
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [currentBox, setCurrentBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const createNewNote = useMutation(api.notes.createNewNote);

    function handleNoteMouseDown(e: React.MouseEvent) {
        if (!noteToolActive) return;
        setStartPos({ x: e.clientX, y: e.clientY });
    }

    function handleNoteMouseMove(e: React.MouseEvent) {
        if (!noteToolActive || !startPos) return;

        const width = e.clientX - startPos.x;
        const height = e.clientY - startPos.y;

        setCurrentBox({
            x: startPos.x,
            y: startPos.y,
            width,
            height
        });
    }

    function handleNoteMouseUp() {
        if (!noteToolActive || !currentBox) return;

        // Send the currentBox data to the database.
        // After saving to the DB, add the note box to your state, so it renders on the screen.

        // Reset temporary state.
        setStartPos(null);
        setCurrentBox(null);
    }
}

