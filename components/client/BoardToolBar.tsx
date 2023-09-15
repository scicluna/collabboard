import { faHand, faMapPin, faNoteSticky, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";

type BoardToolBarProps = {
    dragToolActive: boolean
    setDragToolActive: Dispatch<SetStateAction<boolean>>
    noteToolActive: boolean
    setNoteToolActive: Dispatch<SetStateAction<boolean>>
    lineToolActive: boolean
    setLineToolActive: Dispatch<SetStateAction<boolean>>
    pinToolActive: boolean
    setPinToolActive: Dispatch<SetStateAction<boolean>>
}

//will want styling to determine which tool is currently active. will also modify the onclick to deactivate all other options
export default function BoardToolBar({ dragToolActive, setDragToolActive, noteToolActive, setNoteToolActive, lineToolActive, setLineToolActive, pinToolActive, setPinToolActive }: BoardToolBarProps) {

    function disableAllTools() {
        setDragToolActive(false)
        setNoteToolActive(false)
        setLineToolActive(false)
        setPinToolActive(false)
    }

    return (
        <section className="fixed z-[10000000000000] top-0 left-0 w-1/2 translate-x-1/2 flex gap-6 justify-center items-center bg-white bg-opacity-80 h-16 text-black">
            <button onClick={() => {
                disableAllTools()
                setDragToolActive(true)
            }} className={`${dragToolActive ? `outline-[3px] outline outline-indigo-300` : `outline-none`} rounded-full  transition-all duration-15 items-center flex`} >
                <FontAwesomeIcon icon={faHand} />
            </button>
            <button onClick={() => {
                disableAllTools()
                setNoteToolActive(true)
            }} className={`${noteToolActive ? `outline-[3px] outline outline-indigo-300` : `outline-none`} rounded-full  transition-all duration-15 items-center flex`} >
                <FontAwesomeIcon icon={faNoteSticky} />
            </button>
            <button onClick={() => {
                disableAllTools()
                setLineToolActive(true)
            }} className={`${lineToolActive ? `outline-[3px] outline outline-indigo-300` : `outline-none`} rounded-full  transition-all duration-15 items-center flex`} >
                <FontAwesomeIcon icon={faPencil} />
            </button>
            <button onClick={() => {
                disableAllTools()
                setPinToolActive(true)
            }} className={`${pinToolActive ? `outline-[3px] outline outline-indigo-300` : `outline-none`} rounded-full  transition-all duration-15 items-center flex`} >
                <FontAwesomeIcon icon={faMapPin} />
            </button>
        </section>
    )
}