"use client"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useDebounce } from "@/utils/debounce"
import { useEffect, useState } from "react"
import ResizeWrapper from "./ResizeWrapper"

type NoteCardProps = {
    note: Doc<"notes">
    handleNoteDragStart: (e: React.DragEvent<Element>) => void
    handleNoteDrag: (e: React.DragEvent<Element>, note: Doc<"notes">) => void
    handleNoteDragEnd: (e: React.DragEvent<Element>, note: Doc<"notes">) => void
    updateNoteText: (textContent: string, note: Doc<"notes">) => void
    noteKeyDown: (e: React.KeyboardEvent<Element>, note: Doc<"notes">) => void
    handleNoteResize: (noteId: Id<"notes">, width: number, height: number) => Promise<void>
    currentPosition: {
        noteId: string;
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    zoom: number
}

export default function NoteCard({ note, handleNoteDragStart, handleNoteDrag, handleNoteDragEnd, updateNoteText, noteKeyDown, currentPosition, handleNoteResize, zoom }: NoteCardProps) {
    const [textContent, setTextContent] = useState(note.text)
    const [focused, setFocused] = useState(false)

    useEffect(() => {
        setTextContent(note.text)
    }, [note])

    const debouncedUpdateNoteText = useDebounce(updateNoteText, 500)

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextContent(e.target.value);
        debouncedUpdateNoteText(e.target.value, note);
    };

    return (
        <ResizeWrapper onUpdate={handleNoteResize} object={note} moving={currentPosition} setFocused={setFocused} focused={focused}>
            <div key={note._id}
                style={{ zIndex: `${note.zIndex}px` }}
                className={`h-full w-full note absolute rounded-lg ${currentPosition ? "" : 'transition-all duration-150'}`}
                draggable="true"
                onDragStart={e => handleNoteDragStart(e)}
                onDrag={e => handleNoteDrag(e, note)}
                onDragEnd={e => handleNoteDragEnd(e, note)}>
                <textarea
                    value={textContent}
                    onChange={handleTextChange}
                    onKeyDown={(e) => noteKeyDown(e, note)}
                    className={`note h-full w-full  p-2  outline  rounded-lg ${focused && 'outline-indigo-400 outline-4'} `}
                    style={{ fontSize: note.fontSize || '20px' }} id={`note-${note._id}`}
                />
            </div>
        </ResizeWrapper>

    )
}