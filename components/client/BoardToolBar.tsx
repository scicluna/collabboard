import { faHand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BoardToolBar() {
    return (
        <section className="fixed top-0 left-0 w-1/2 translate-x-1/2 flex justify-center items-center bg-white bg-opacity-80 h-16">
            <FontAwesomeIcon icon={faHand} />
        </section>
    )
}