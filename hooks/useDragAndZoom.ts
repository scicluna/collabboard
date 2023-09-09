"use client"

import { useState } from "react";

type UseDragAndZoomProps = {
    initialZoom?: number;
    dragToolActive?: boolean;
};

function useDragAndZoom({
    initialZoom = 1,
    dragToolActive = true // eventually will start as false
}: UseDragAndZoomProps) {
    const [zoom, setZoom] = useState(initialZoom);
    const [dragging, setDragging] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    function handleZoom(event: React.WheelEvent) {
        const MAX_ZOOM = 4;
        const MIN_ZOOM = 0.5;

        if (zoom >= 4) {
            event.preventDefault();
            event.stopPropagation();
        }

        let newZoom = zoom - event.deltaY * 0.001;
        newZoom = Math.min(Math.max(MIN_ZOOM, newZoom), MAX_ZOOM);
        setZoom(newZoom);
    }

    function dragMouseDown(e: React.MouseEvent) {
        if ((e.target as HTMLElement).classList.contains('note')) return;
        if (!dragToolActive) return;

        window.getSelection()?.removeAllRanges();
        (document.activeElement as HTMLElement).blur();
        setDragging(true);
        setMousePos({ x: e.clientX, y: e.clientY });
    }

    function dragMouseMove(e: React.MouseEvent) {
        if (!dragToolActive) return;

        if (dragging) {
            const dx = e.clientX - mousePos.x;
            const dy = e.clientY - mousePos.y;
            window.scrollTo(window.scrollX - dx, window.scrollY - dy);
            setMousePos({ x: e.clientX, y: e.clientY });
        }
    }

    function dragMouseUp() {
        if (!dragToolActive) return;
        setDragging(false);
    }

    const cursorLogic = dragging ? 'grabbing' : dragToolActive ? 'grab' : 'default';

    return {
        zoom,
        handleZoom,
        dragMouseDown,
        dragMouseMove,
        dragMouseUp,
        cursorLogic
    };
}

export default useDragAndZoom;
