"use client"
import { Doc } from "@/convex/_generated/dataModel"
import { useDebounce } from "@/utils/debounce"
import { useEffect, useRef, useState } from "react"
import ResizeWrapper from "./ResizeWrapper"
import { adjustFontSize } from "@/utils/adjustfont"

type NoteCardProps = {
    note: Doc<"notes">
    handleNoteDragStart: (e: React.DragEvent<Element>) => void
    handleNoteDrag: (e: React.DragEvent<Element>, note: Doc<"notes">) => void
    handleNoteDragEnd: (e: React.DragEvent<Element>, note: Doc<"notes">) => void
    updateNoteText: (fontSize: number, textContent: string, note: Doc<"notes">) => void
    noteKeyDown: (e: React.KeyboardEvent<Element>, note: Doc<"notes">) => void
    handleNoteResize: (note: Doc<"notes">) => Promise<void>
    currentPosition: {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
}

export default function NoteCard({ note, handleNoteDragStart, handleNoteDrag, handleNoteDragEnd, updateNoteText, noteKeyDown, currentPosition, handleNoteResize }: NoteCardProps) {
    const [textContent, setTextContent] = useState(note.text)
    const [focused, setFocused] = useState(false)
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textAreaRef.current) {
            const newSize = adjustFontSize(textAreaRef.current, textContent);
            debouncedUpdateNoteText(newSize, textContent, note)
        }
    }, [note, textContent])

    const debouncedUpdateNoteText = useDebounce(updateNoteText, 500)

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextContent(e.target.value);
    };

    return (
        <ResizeWrapper
            onUpdate={handleNoteResize}
            doc={note}
            moving={currentPosition}
            setFocused={setFocused}
            focused={focused}
        >
            <div key={note._id}
                style={{ zIndex: `${note.zIndex}px` }}
                className={`h-full w-full note absolute rounded-lg
                 ${currentPosition ? "" : 'transition-all duration-150'}`}
                draggable="true"
                onDragStart={e => handleNoteDragStart(e)}
                onDrag={e => handleNoteDrag(e, note)}
                onDragEnd={e => handleNoteDragEnd(e, note)}>
                <textarea
                    ref={textAreaRef}
                    value={textContent}
                    onChange={handleTextChange}
                    onKeyDown={(e) => noteKeyDown(e, note)}
                    className={`note h-full w-full  p-2 resize-none outline  rounded-lg overflow-hidden ${focused && 'outline-indigo-400 outline-4'} `}
                    id={`note-${note._id}`}
                    style={{ fontSize: note.fontSize }}
                />
            </div>
        </ResizeWrapper>

    )
}