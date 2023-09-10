type NotePreviewProps = {
    currentBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
};

export default function NotePreview({ currentBox }: NotePreviewProps) {
    if (!currentBox) return <></>

    return (
        <div style={{ width: `${currentBox.width}px`, height: `${currentBox.height}px`, top: `${currentBox.y}px`, left: `${currentBox.x}px` }} className="note absolute rounded-lg" >
            <textarea className={`note h-full w-full  p-2  outline outline-black  focus:outline-red-600 focus:outline-4 rounded-lg`} />
        </div>
    )
}