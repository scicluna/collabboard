import { faHand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";

type BoardToolBarProps = {
    dragToolActive: boolean
    setDragToolActive: Dispatch<SetStateAction<boolean>>
}

//will want styling to determine which tool is currently active. will also modify the onclick to deactivate all other options
export default function BoardToolBar({ dragToolActive, setDragToolActive }: BoardToolBarProps) {
    return (
        <section className="fixed top-0 left-0 w-1/2 translate-x-1/2 flex justify-center items-center bg-white bg-opacity-80 h-16">
            <button onClick={() => setDragToolActive(prev => !prev)}>
                <FontAwesomeIcon icon={faHand} />
            </button>
        </section>
    )
}