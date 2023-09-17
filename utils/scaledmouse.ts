export function scaledMouse(e: React.MouseEvent, zoom: number, pos?: { x: number, y: number }) {
    const canvasRect = e.currentTarget.getBoundingClientRect();

    const relativeX = e.clientX - canvasRect.left + e.currentTarget.scrollLeft;
    const relativeY = e.clientY - canvasRect.top + e.currentTarget.scrollTop;

    const scaledX = relativeX / zoom;
    const scaledY = relativeY / zoom;

    let width: number;
    let height: number;
    let x: number;
    let y: number;

    if (pos) {
        width = Math.abs(scaledX - pos.x);
        height = Math.abs(scaledY - pos.y);
        x = scaledX > pos.x ? pos.x : pos.x - width;
        y = scaledY > pos.y ? pos.y : pos.y - height;
    } else {
        return {
            scaledX, scaledY
        }
    }
    return {
        x, y, width, height
    }
}
