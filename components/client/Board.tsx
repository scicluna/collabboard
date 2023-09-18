"use client"
import { useState, useEffect, useRef } from "react"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import useDragAndZoom from "@/hooks/useDragAndZoom"
import useNoteTool from "@/hooks/useNoteTool"
import BoardToolBar from "@/components/client/BoardToolBar"
import NoteCard from "@/components/client/NoteCard"
import NotePreview from "@/components/client/NotePreview";
import useNoteUpdating from "@/hooks/useNoteUpdating";
import SvgLayer from "@/components/client/SvgLayer";
import { useLineTool } from "@/hooks/useLineTool";
import Pin from "@/components/client/Pin";
import { usePinTool } from "@/hooks/usePinTool";
import PinPreview from "@/components/client/PinPreview";
import ImageCard from "@/components/client/ImageCard";
import { useImage } from "@/hooks/useImage";
import Rail from "@/components/server/Rail";
import BoardDash from "@/components/client/BoardDash";

type BoardProps = {
    userId: string
    boardId: string
}

export default function Board({ userId, boardId }: BoardProps) {
    const [active, setActive] = useState(false)
    const [dragToolActive, setDragToolActive] = useState(true)
    const [noteToolActive, setNoteToolActive] = useState(false)
    const [lineToolActive, setLineToolActive] = useState(false)
    const [pinToolActive, setPinToolActive] = useState(false)
    const [maxZIndex, setMaxZIndex] = useState<number>(0)
    const canvasRef = useRef(null);

    const notes = useQuery(api.notes.getNotes, { boardId: boardId })
    const pins = useQuery(api.pins.getPins, { boardId: boardId })
    const images = useQuery(api.images.getImages, { boardId: boardId })

    const { zoom, handleZoom, dragMouseDown, dragMouseMove, dragMouseUp, cursorLogic, arrowDragKeyDown }
        = useDragAndZoom({ initialZoom: 1, dragToolActive })
    const { handleNoteMouseDown, handleNoteMouseMove, handleNoteMouseUp, currentBox }
        = useNoteTool({ noteToolActive, userId, boardId, zoom, maxZIndex })
    const { handleLineMouseDown, handleLineMouseMove, handleLineMouseUp, handleLineResize, lineKeyDown, handleLineDrag, currentPath }
        = useLineTool({ lineToolActive, userId, boardId, zoom, maxZIndex })
    const { handlePinMouseDown, handlePinMouseMove, handlePinMouseUp, handlePinDragStart, handlePinDragMove, handlePinDragEnd, pinKeyDown, handlePinResize, currentPinPos }
        = usePinTool({ boardId, userId, pinToolActive, zoom, maxZIndex })
    const { noteKeyDown, updateNoteText, handleNoteDragStart, handleNoteDrag, handleNoteDragEnd, currentPosition, handleNoteResize }
        = useNoteUpdating({ zoom, maxZIndex })
    const { imageDragHandler, handleImageResize, handleImageDragMove, handleImageDragEnd, imageKeyDown, currentImagePos }
        = useImage({ userId, boardId, zoom, maxZIndex })

    useEffect(() => {
        if (notes && pins && images) {
            const noteZ = Math.max(...(notes?.map(note => note.zIndex) || [0]));
            const pinsZ = Math.max(...(pins?.map(pin => pin.zIndex) || [0]));
            const imageZ = Math.max(...(images?.map(image => image.zIndex) || [0]));
            setMaxZIndex(Math.max(noteZ, pinsZ, imageZ, 0) + 1);
        }
    }, [notes, pins, images])

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
        if (lineToolActive) {
            return {
                mouseDown: handleLineMouseDown,
                mouseMove: handleLineMouseMove,
                mouseUp: handleLineMouseUp
            }
        }
        if (pinToolActive) {
            return {
                mouseDown: handlePinMouseDown,
                mouseMove: handlePinMouseMove,
                mouseUp: handlePinMouseUp
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
        <main className="absolute  w-[3500px] h-[3250px]
         bg-black flex items-center justify-center"
            style={{ visibility: active ? 'visible' : 'hidden', fontFamily: 'fantasy' }} >
            <div tabIndex={-1} id="focusDiv" style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: 1, height: 1 }}></div>
            <BoardToolBar
                dragToolActive={dragToolActive}
                setDragToolActive={setDragToolActive}
                noteToolActive={noteToolActive}
                setNoteToolActive={setNoteToolActive}
                lineToolActive={lineToolActive}
                setLineToolActive={setLineToolActive}
                pinToolActive={pinToolActive}
                setPinToolActive={setPinToolActive}
            />
            <BoardDash />
            {/* <Toolbar createNewNote={createNewNote}  createNewPin={createNewPin} createNewLine={createNewLine}/> */}
            <section ref={canvasRef} tabIndex={0} className={`w-[2500px] h-[1500px] bg-gray-100 overflow-hidden outline-none relative z-20`}
                onMouseDown={Tool.mouseDown}
                onMouseMove={Tool.mouseMove}
                onMouseUp={Tool.mouseUp}
                onMouseLeave={Tool.mouseUp}
                onWheel={handleZoom}
                onKeyDown={arrowDragKeyDown} style={{ transform: `scale(${zoom})`, cursor: cursorLogic }}
                onDragOver={e => e.preventDefault()}
                onDrop={imageDragHandler}>

                {/* populate notes and connections and lines and images */}
                {notes && notes.map(note => (
                    <NoteCard
                        key={note._id}
                        note={note}
                        noteKeyDown={noteKeyDown}
                        updateNoteText={updateNoteText}
                        handleNoteDragStart={handleNoteDragStart}
                        handleNoteDrag={handleNoteDrag}
                        handleNoteDragEnd={handleNoteDragEnd}
                        currentPosition={currentPosition}
                        handleNoteResize={handleNoteResize}
                    />
                ))}
                {images && images.map(image => (
                    <ImageCard key={image._id}
                        image={image}
                        handleImageResize={handleImageResize}
                        handleImageDragStart={imageDragHandler}
                        handleImageDragMove={handleImageDragMove}
                        handleImageDragEnd={handleImageDragEnd}
                        imageKeyDown={imageKeyDown}
                        currentImagePos={currentImagePos} />
                ))}
                {pins && pins.map(pin => (
                    <Pin
                        key={pin._id}
                        pin={pin}
                        currentPinPos={currentPinPos}
                        handlePinDragStart={handlePinDragStart}
                        handlePinDragMove={handlePinDragMove}
                        handlePinDragEnd={handlePinDragEnd}
                        pinKeyDown={pinKeyDown}
                        handlePinResize={handlePinResize} />
                ))}
                <SvgLayer
                    boardId={boardId}
                    handleLineResize={handleLineResize}
                    currentPosition={currentPosition}
                    currentPath={currentPath}
                    lineKeyDown={lineKeyDown}
                    handleLineDrag={handleLineDrag}
                    pins={pins}
                    currentPinPos={currentPinPos}
                    maxZIndex={maxZIndex}
                />
                <NotePreview currentBox={currentBox} currentPosition={currentPosition} maxZIndex={maxZIndex} />
                <PinPreview currentPinPos={currentPinPos} maxZIndex={maxZIndex} />

            </section>
            <Rail zoom={zoom} />
        </main>
    )



}
