"use client"
import { useState, useEffect, useRef } from "react"
import BoardToolBar from "@/components/client/BoardToolBar"
import useDragAndZoom from "@/hooks/useDragAndZoom"
import useNoteTool from "@/hooks/useNoteTool"

type BoardProps = {
    boardid: string
    userid: string
}

export default function Board({ boardid, userid }: BoardProps) {
    const [active, setActive] = useState(false)
    const [dragToolActive, setDragToolActive] = useState(false)
    const [noteToolActive, setNoteToolActive] = useState(true)  //will eventually default to false
    const { zoom, handleZoom, dragMouseDown, dragMouseMove, dragMouseUp, cursorLogic, arrowDragKeyDown } = useDragAndZoom({ initialZoom: 1, dragToolActive })
    const { handleNoteMouseDown, handleNoteMouseMove, handleNoteMouseUp } = useNoteTool({ noteToolActive, userid, boardid })
    const canvasRef = useRef(null);

    //const notes = useQuery("getNotes", {boardid})
    //const createNewNote = useMutation("createNewNote")
    //const createNewPin = useMutation("createNewPin")
    //const createNewLine = useMutation("createNewLine")

    //center camera on load
    useEffect(() => {
        window.scrollTo((3500 - window.innerWidth) / 2, (3250 - window.innerHeight) / 2)
        document.body.style.overflow = 'hidden';
        setActive(true)
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    const activeTool = () => {
        if (dragToolActive) {
            return {
                mouseDown: dragMouseDown,
                mouseMove: dragMouseMove,
                mouseUp: dragMouseUp,
            }
        }
        if (noteToolActive) {
            return {
                mouseDown: handleNoteMouseDown,
                mouseMove: handleNoteMouseMove,
                mouseUp: handleNoteMouseUp
            }
        }

        return {
            mouseDown: () => { },
            mouseMove: () => { },
            mouseUp: () => { }
        }
    }
    const Tool = activeTool()

    return (
        <main className="absolute w-[3500px] h-[3250px]
         bg-black flex items-center justify-center"
            style={{ visibility: active ? 'visible' : 'hidden', fontFamily: 'fantasy' }} >
            <BoardToolBar
                dragToolActive={dragToolActive}
                setDragToolActive={setDragToolActive}
                noteToolActive={noteToolActive}
                setNoteToolActive={setNoteToolActive}
            />
            {/* <Toolbar createNewNote={createNewNote}  createNewPin={createNewPin} createNewLine={createNewLine}/> */}
            <section ref={canvasRef} tabIndex={0} className={`w-[2500px] h-[2250px] bg-gray-100 overflow-hidden outline-none`}
                onMouseDown={Tool.mouseDown}
                onMouseMove={Tool.mouseMove}
                onMouseUp={Tool.mouseUp}
                onMouseLeave={Tool.mouseUp}
                onWheel={handleZoom}
                onKeyDown={arrowDragKeyDown} style={{ transform: `scale(${zoom})`, cursor: cursorLogic }}>
                {/* populate notes and connections and lines and images */}
            </section>
        </main>
    )



}
