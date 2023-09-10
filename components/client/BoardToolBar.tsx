import { faHand, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";

type BoardToolBarProps = {
    dragToolActive: boolean
    setDragToolActive: Dispatch<SetStateAction<boolean>>
    noteToolActive: boolean
    setNoteToolActive: Dispatch<SetStateAction<boolean>>
}

//will want styling to determine which tool is currently active. will also modify the onclick to deactivate all other options
export default function BoardToolBar({ dragToolActive, setDragToolActive, noteToolActive, setNoteToolActive }: BoardToolBarProps) {

    function disableAllTools() {
        setDragToolActive(prev => false)
        setNoteToolActive(prev => false)
    }


    return (
        <section className="fixed z-[10000000000000] top-0 left-0 w-1/2 translate-x-1/2 flex gap-6 justify-center items-center bg-white bg-opacity-80 h-16 text-black">
            <button onClick={() => {
                disableAllTools()
                setDragToolActive(prev => true)
            }} className={`${dragToolActive ? `outline-[3px] outline outline-indigo-300` : `outline-none`} rounded-full  transition-all duration-15 items-center flex`} >
                <FontAwesomeIcon icon={faHand} />
            </button>
            <button onClick={() => {
                disableAllTools()
                setNoteToolActive(prev => true)
            }} className={`${noteToolActive ? `outline-[3px] outline outline-indigo-300` : `outline-none`} rounded-full  transition-all duration-15 items-center flex`} >
                <FontAwesomeIcon icon={faNoteSticky} />
            </button>
        </section>
    )
}