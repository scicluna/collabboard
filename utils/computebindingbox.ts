export function computeBoundingBox(path: string) {
    const commands = path.split(' ');

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        if (cmd === 'M' || cmd === 'L') {
            const x = parseFloat(commands[++i]);
            const y = parseFloat(commands[++i]);

            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }
        if (cmd === 'C') {
            const x1 = parseFloat(commands[++i]);
            const y1 = parseFloat(commands[++i]);
            const x2 = parseFloat(commands[++i]);
            const y2 = parseFloat(commands[++i]);
            const x = parseFloat(commands[++i]);
            const y = parseFloat(commands[++i]);

            // Adjust bounding box for control points and end point
            minX = Math.min(minX, x1, x2, x);
            minY = Math.min(minY, y1, y2, y);
            maxX = Math.max(maxX, x1, x2, x);
            maxY = Math.max(maxY, y1, y2, y);
        }
    }

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}