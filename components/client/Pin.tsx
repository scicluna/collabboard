"use client"
import { Doc } from "@/convex/_generated/dataModel"
import { useState } from "react"
import ResizeWrapper from "./ResizeWrapper"

type PinProps = {
    pin: Doc<"pins">
    currentPinPos: { id: string, x: number, y: number } | null
    handlePinDragStart: (e: React.DragEvent<Element>) => void
    handlePinDragMove: (e: React.DragEvent<Element>, pin: Doc<"pins">) => void
    handlePinDragEnd: (e: React.DragEvent<Element>, pin: Doc<"pins">) => void
    pinKeyDown: (e: React.KeyboardEvent, pin: Doc<"pins">) => void
    handlePinResize: (pin: Doc<"pins">) => void
}

export default function Pin({ pin, currentPinPos, handlePinDragStart, handlePinDragMove, handlePinDragEnd, pinKeyDown, handlePinResize }: PinProps) {
    const [focus, setFocus] = useState(false)
    return (
        <ResizeWrapper onUpdate={handlePinResize} doc={pin} moving={currentPinPos} focused={focus} setFocused={setFocus}>
            <div
                key={pin._id}
                className={`pin h-full w-full flex justify-center items-center
            ${focus ? 'text-red-600' : 'text-indigo-300'} 
            ${currentPinPos?.id === pin._id && 'invisible'}
            `}
                tabIndex={0}
                onClick={e => setFocus(true)}
                onBlur={e => setFocus(false)}
                data-id={pin._id}
                draggable={true}
                onDragStart={handlePinDragStart}
                onDrag={e => handlePinDragMove(e, pin)}
                onDragEnd={e => handlePinDragEnd(e, pin)}
                onKeyDown={e => pinKeyDown(e, pin)}
            >
                <svg
                    width="100%"
                    height="100%"
                    version="1.1"
                    viewBox="0 0 1083.5753 1806.7814"
                    className="pin"
                    data-id={pin._id}
                    onKeyDown={e => pinKeyDown(e, pin)}>
                    <g
                        className="pin"
                        id="g118"
                        transform="translate(-532.75975,-247.64538)"
                        onKeyDown={e => pinKeyDown(e, pin)}>
                        <path
                            className="pin"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            fill="currentColor"
                            stroke="#000000"
                            strokeWidth="37"
                            strokeMiterlimit="10"
                            d="M 1075.9399,1959.629 C 1037.1741,1769.328 968.82404,1610.964 886.03699,1464.1891 824.63001,1355.317 753.49304,1254.8261 687.67297,1149.2511 665.70099,1114.0071 646.73901,1076.774 625.62598,1040.197 583.41003,967.06006 549.18201,882.26202 551.35699,772.26502 c 2.125,-107.47297 33.20801,-193.68396 78.02997,-264.172 73.71906,-115.93497 197.20105,-210.98898 362.88404,-235.969 135.4661,-20.42398 262.4751,14.08204 352.543,66.74802 73.6001,43.03799 130.596,100.52701 173.92,168.28 45.22,70.716 76.359,154.26001 78.971,263.23199 1.337,55.83002 -7.805,107.53199 -20.684,150.41797 -13.0339,43.40906 -33.996,79.695 -52.646,118.4541 -36.406,75.6589 -82.049,144.9819 -127.855,214.346 -136.437,206.6059 -264.4961,417.3099 -320.5801,706.0269 z"
                            id="svg_2"
                            data-id={pin._id}
                            onKeyDown={e => pinKeyDown(e, pin)} />
                        <circle
                            fillRule="evenodd"
                            clipRule="evenodd"
                            cx="1080.546"
                            cy="740.047"
                            r="183.33203"
                            id="svg_4"
                            fill="#000000"
                            className="pin"
                            data-id={pin._id}
                            onKeyDown={e => pinKeyDown(e, pin)} />
                    </g>
                </svg>
            </div >
        </ResizeWrapper>
    )
}