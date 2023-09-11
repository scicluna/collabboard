"use client"
import { Doc } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

type NoteCardProps = {
    note: Doc<"notes">
    noteToolActive: boolean
}


export default function NoteCard({ note, noteToolActive }: NoteCardProps) {
    const deleteNote = useMutation(api.notes.deleteNote)
    const updateNote = useMutation(api.notes.updateNote)

    function updateNoteText(e: React.ChangeEvent<HTMLTextAreaElement>, note: Doc<"notes">) {
        e.preventDefault()
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
            text: e.currentTarget.value
        })
    }

    async function noteKeyDown(e: React.KeyboardEvent, note: Doc<"notes">) {
        if (e.key === "Delete") {
            e.preventDefault()
            await deleteNote({ noteId: note._id })
        }
    }

    function handleNoteDragStart(e: React.DragEvent, note: Doc<"notes">) {

    }
    function handleNoteDragEnd(e: React.DragEvent, note: Doc<"notes">) {

    }
    return (
        <div key={note._id} style={{ width: `${note.width}px`, height: `${note.height}px`, top: `${note.y}px`, left: `${note.x}px`, zIndex: `${note.zIndex}px` }} className="note absolute rounded-lg" draggable="true" onDragStart={e => handleNoteDragStart(e, note)} onDragEnd={e => handleNoteDragEnd(e, note)}>
            <textarea
                value={note.text}
                onChange={(e) => updateNoteText(e, note)}
                onKeyDown={(e) => noteKeyDown(e, note)}
                className={`note h-full w-full  p-2  outline outline-black  focus:outline-red-600 focus:outline-4 rounded-lg `}
                style={{ fontSize: note.fontSize || '20px' }} id={`note-${note._id}`}
                contentEditable suppressContentEditableWarning={true} />
        </div>
    )
}