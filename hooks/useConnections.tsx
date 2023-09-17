"use client"

import { Doc } from "@/convex/_generated/dataModel";
import { useRef } from "react";

export type Connection = {
    pinOne: Doc<"pins">
    pinTwo: Doc<"pins">
}

export function useConnections() {
    const drawnConnections = useRef(new Set()).current;

    function getConnections(pins: Doc<"pins">[]) {
        const connections: Connection[] = [];
        drawnConnections.clear()

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

    function generateConnectionPath(
        pin: Doc<"pins"> | { _id: string, x: number, y: number },
        connectedPin: Doc<"pins"> | { _id: string, x: number, y: number },
        currentPinPos?: { id: string, x: number, y: number } | null): JSX.Element | null {
        const connectionKey = [pin._id, connectedPin._id].sort().join('-');

        console.log("go")
        if (!drawnConnections.has(connectionKey) && pin._id !== connectedPin._id) {
            drawnConnections.add(connectionKey)

            const deltaY = Math.abs(connectedPin.y - pin.y);
            const deltaX = Math.abs(connectedPin.x - pin.x);
            const offset = Math.max(deltaY, 100);

            const controlPoint1X = pin.x + (deltaX / 3);
            const controlPoint1Y = pin.y + offset;

            const controlPoint2X = connectedPin.x - (deltaX / 3);
            const controlPoint2Y = connectedPin.y + offset;

            let origin: 'left' | 'right' | 'neither' = 'neither'
            if (currentPinPos?.id === pin._id) {
                origin = "left"
                console.log("current pin is origin pin")
            }
            if (currentPinPos?.id === connectedPin._id) {
                origin = "right"
                console.log("current pin is connecting Pin")
            }

            const pathData = `M${origin === 'left' ? currentPinPos?.x : pin.x} ${origin === 'left' ? currentPinPos?.y : pin.y} 
            C${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, 
            ${origin === 'right' ? currentPinPos?.x : connectedPin.x} ${origin === 'right' ? currentPinPos?.y : connectedPin.y}`;

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