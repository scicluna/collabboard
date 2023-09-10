import { Doc } from "@/convex/_generated/dataModel"

type NoteCardProps = {
    note: Doc<"notes">
    noteToolActive: boolean
}


export default function NoteCard({ note, noteToolActive }: NoteCardProps) {
    function updateNoteText(e: React.FocusEvent<HTMLTextAreaElement>, note: Doc<"notes">) {

    }
    function handleNoteDragStart(e: React.DragEvent, note: Doc<"notes">) {

    }
    function handleNoteDragEnd(e: React.DragEvent, note: Doc<"notes">) {

    }
    return (
        <div key={note._id} style={{ width: `${note.width}px`, height: `${note.height}px`, top: `${note.y}px`, left: `${note.x}px`, zIndex: `${note.zIndex}px` }} className="note absolute rounded-lg" draggable="true" onDragStart={e => handleNoteDragStart(e, note)} onDragEnd={e => handleNoteDragEnd(e, note)}>
            <textarea defaultValue={note.text} onBlur={(e) => updateNoteText(e, note)} className={`note h-full w-full  p-2  outline outline-black  focus:outline-red-600 focus:outline-4 rounded-lg `} style={{ fontSize: note.fontSize || '20px' }} id={`note-${note._id}`} contentEditable suppressContentEditableWarning={true} />
        </div>
    )
}