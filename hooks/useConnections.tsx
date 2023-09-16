"use client"

import { Doc } from "@/convex/_generated/dataModel";

export type Connection = {
    pinOne: Doc<"pins">
    pinTwo: Doc<"pins">
}

export function useConnections() {
    const drawnConnections = new Set()
    drawnConnections.clear()

    function getConnections(pins: Doc<"pins">[]) {
        const connections: Connection[] = [];

        if (!pins) return []

        pins.forEach(pin => {
            pin.connectedPins?.forEach(connectedPinId => {
                const connectedPin = pins.find(n => n._id === connectedPinId);
                if (connectedPin) {
                    const connection = {
                        pinOne: pin,
                        pinTwo: connectedPin
                    };
                    connections.push(connection);
                }
            });
        });

        return connections
    }

    function generateConnectionPath(pin: Doc<"pins">, connectedPin: Doc<"pins">): JSX.Element | null {
        const connectionKey = [pin._id, connectedPin._id].sort().join('-');

        if (!drawnConnections.has(connectionKey) && pin._id !== connectedPin._id) {
            drawnConnections.add(connectionKey)

            const deltaY = Math.abs(connectedPin.y - pin.y);
            const deltaX = Math.abs(connectedPin.x - pin.x);
            const offset = Math.max(deltaY, 100);

            const controlPoint1X = pin.x + (deltaX / 3);
            const controlPoint1Y = pin.y + offset;

            const controlPoint2X = connectedPin.x - (deltaX / 3);
            const controlPoint2Y = connectedPin.y + offset;

            const pathData = `M${pin.x} ${pin.y} C${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${connectedPin.x} ${connectedPin.y}`;

            return (
                <path
                    key={`${pin._id}-${connectedPin._id}`}
                    d={pathData}
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                />
            );
        }
        return null;
    }

    return {
        getConnections,
        generateConnectionPath,
    }

}