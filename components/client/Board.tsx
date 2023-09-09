"use client"
import { useState, useEffect } from "react"
import BoardToolBar from "@/components/client/BoardToolBar"
import useDragAndZoom from "@/hooks/useDragAndZoom"

type BoardProps = {
    boardid: string
    userid: string
}

export default function Board({ boardid, userid }: BoardProps) {
    const [active, setActive] = useState(false)
    const [dragToolActive, setDragToolActive] = useState(true) //will eventually default to false
    const { zoom, handleZoom, dragMouseDown, dragMouseMove, dragMouseUp, cursorLogic } = useDragAndZoom({ initialZoom: 1, dragToolActive })

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

    return (
        <main className="absolute w-[3500px] h-[3250px]
         bg-black flex items-center justify-center"
            style={{ visibility: active ? 'visible' : 'hidden', fontFamily: 'fantasy' }} >
            <BoardToolBar dragToolActive={dragToolActive} setDragToolActive={setDragToolActive} />
            {/* <Toolbar createNewNote={createNewNote}  createNewPin={createNewPin} createNewLine={createNewLine}/> */}
            <section className={`w-[50px] h-[50px] bg-gray-100 overflow-hidden`}
                onMouseDown={dragMouseDown} onMouseMove={dragMouseMove} onMouseUp={dragMouseUp} onMouseLeave={dragMouseUp}
                onWheel={handleZoom} style={{ transform: `scale(${zoom})`, cursor: cursorLogic }}>
                {/* populate notes and connections and lines and images */}
            </section>
        </main>
    )



}