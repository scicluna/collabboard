"use client"
import { useState, useEffect } from "react"
import BoardToolBar from "@/components/client/BoardToolBar"

type BoardProps = {
    boardid: string
    userid: string
}

export default function Board({ boardid, userid }: BoardProps) {
    const [active, setActive] = useState(false)
    const [zoom, setZoom] = useState(1)
    const [dragToolActive, setDragToolActive] = useState(true) //will eventually default to false
    const [dragging, setDragging] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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

    function handleZoom(event: React.WheelEvent) {
        const MAX_ZOOM = 4
        const MIN_ZOOM = .5

        if (zoom >= 4) {
            event.preventDefault();
            event.stopPropagation();
        }
        let newZoom = zoom - event.deltaY * 0.001;
        newZoom = Math.min(Math.max(MIN_ZOOM, newZoom), MAX_ZOOM)
        setZoom(newZoom);
    }

    function dragMouseDown(e: React.MouseEvent) {
        if ((e.target as HTMLElement).classList.contains('note')) return;
        if (!dragToolActive) return
        window.getSelection()?.removeAllRanges();
        (document.activeElement as HTMLElement).blur()
        setDragging(true);
        setMousePos({ x: e.clientX, y: e.clientY });
    }

    function dragMouseMove(e: React.MouseEvent) {
        if (!dragToolActive) return
        if (dragging) {
            const dx = e.clientX - mousePos.x;
            const dy = e.clientY - mousePos.y;
            window.scrollTo(window.scrollX - dx, window.scrollY - dy);
            setMousePos({ x: e.clientX, y: e.clientY });
        }
    }

    function dragMouseUp() {
        if (!dragToolActive) return
        setDragging(false);
    }



    return (
        <main className="absolute w-[3500px] h-[3250px]
         bg-black flex items-center justify-center"
            style={{ visibility: active ? 'visible' : 'hidden', fontFamily: 'fantasy' }} >
            <BoardToolBar />
            {/* <Toolbar createNewNote={createNewNote}  createNewPin={createNewPin} createNewLine={createNewLine}/> */}
            <section className={`w-[50px] h-[50px] bg-gray-100 overflow-hidden`}
                onMouseDown={dragMouseDown} onMouseMove={dragMouseMove} onMouseUp={dragMouseUp} onMouseLeave={dragMouseUp}
                onWheel={handleZoom} style={{ transform: `scale(${zoom})` }}>

            </section>
        </main>
    )



}