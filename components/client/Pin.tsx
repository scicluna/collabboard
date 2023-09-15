"use client"
import { Doc } from "@/convex/_generated/dataModel"
import { useState } from "react"

type PinProps = {
    pin: Doc<"pins">
}

export default function Pin({ pin }: PinProps) {
    const [focus, setFocus] = useState(false)
    return (
        <div
            key={pin._id}
            style={{ top: `${pin.y}px`, left: `${pin.x}px` }}
            className={`absolute pin h-8 w-6 flex justify-center items-center  ${focus ? 'text-red-600' : 'text-indigo-300'} -translate-x-1/2 -translate-y-1/2`}
            tabIndex={0}
            onClick={e => setFocus(true)}
            onBlur={e => setFocus(false)}
            data-id={pin._id}
        >
            <svg
                width="100%"
                height="100%"
                version="1.1"
                viewBox="0 0 1083.5753 1806.7814"
                className="pin"
                data-id={pin._id}>

                <g
                    className="pin"
                    id="g118"
                    transform="translate(-532.75975,-247.64538)">
                    <title
                        id="title114">Layer 1</title>
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
                        data-id={pin._id} />
                    <circle
                        fillRule="evenodd"
                        clipRule="evenodd"
                        cx="1080.546"
                        cy="740.047"
                        r="183.33203"
                        id="svg_4"
                        fill="#000000"
                        className="pin"
                        data-id={pin._id} />
                </g>
            </svg>
        </div >
    )
}