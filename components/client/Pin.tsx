import { Doc } from "@/convex/_generated/dataModel"
import { faMapPin } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type PinProps = {
    pin: Doc<"pins">
}

export default function Pin({ pin }: PinProps) {
    return (
        <div key={pin._id}
            style={{ top: `${pin.y}px`, left: `${pin.x}px` }}
            className="absolute">
            <FontAwesomeIcon icon={faMapPin} />
        </div>
    )
}