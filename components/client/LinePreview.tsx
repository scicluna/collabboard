"use client"

type LinePreviewProps = {
    currentPath: string
};

export default function LinePreview({ currentPath }: LinePreviewProps) {
    return (
        <path
            d={currentPath}
            stroke={"gray"}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            style={{ zIndex: `${10000000}px` }}
            className="pointer-events-auto line"
        />
    )
}