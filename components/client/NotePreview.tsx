"use client"

type NotePreviewProps = {
    currentBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    currentPosition: {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    maxZIndex: number
};

export default function NotePreview({ currentPosition, currentBox, maxZIndex }: NotePreviewProps) {
    let mode = currentBox ?? currentPosition
    if (!mode || mode.x < 0) {
        return <></>
    }
    return (
        <div style={{
            width: `${mode.width}px`,
            height: `${mode.height}px`,
            top: `${mode.y}px`,
            left: `${mode.x}px`,
            zIndex: maxZIndex
        }} className="note absolute rounded-lg" >
            <textarea className={`note h-full w-full  p-2  outline  outline-indigo-400 focus:outline-4 rounded-lg bg-slate-700 bg-opacity-70 `} />
        </div>
    )
}