"use client"
import { Doc } from "@/convex/_generated/dataModel"
import { useDebounce } from "@/utils/debounce"
import { useState } from "react"

type NoteCardProps = {
    note: Doc<"notes">
    handleNoteDragStart: (e: React.DragEvent<Element>) => void
    handleNoteDrag: (e: React.DragEvent<Element>, note: Doc<"notes">) => void
    handleNoteDragEnd: (e: React.DragEvent<Element>, note: Doc<"notes">) => void
    updateNoteText: (textContent: string, note: Doc<"notes">) => void
    noteKeyDown: (e: React.KeyboardEvent<Element>, note: Doc<"notes">) => void,
    currentPosition: {
        noteId: string;
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
}

export default function NoteCard({ note, handleNoteDragStart, handleNoteDrag, handleNoteDragEnd, updateNoteText, noteKeyDown, currentPosition }: NoteCardProps) {
    const [textContent, setTextContent] = useState(note.text)

    const debouncedUpdateNoteText = useDebounce(updateNoteText, 150)

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextContent(e.target.value);
        debouncedUpdateNoteText(e.target.value, note);
    };

    return (
        <div key={note._id}
            style={{ width: `${note.width}px`, height: `${note.height}px`, top: `${note.y}px`, left: `${note.x}px`, zIndex: `${note.zIndex}px` }}
            className="note absolute rounded-lg cursor-pointer"
            draggable="true"
            onDragStart={e => handleNoteDragStart(e)}
            onDrag={e => handleNoteDrag(e, note)}
            onDragEnd={e => handleNoteDragEnd(e, note)}>
            <textarea
                value={textContent}
                onChange={handleTextChange}
                onKeyDown={(e) => noteKeyDown(e, note)}
                className={`note h-full w-full  p-2  outline outline-black  focus:outline-indigo-400 focus:outline-4 rounded-lg`}
                style={{ fontSize: note.fontSize || '20px', display: currentPosition?.noteId === note._id ? 'none' : 'block' }} id={`note-${note._id}`}
                contentEditable suppressContentEditableWarning={true}
            />
        </div>
    )
}