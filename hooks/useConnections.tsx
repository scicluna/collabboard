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
        pin: Doc<"pins">,
        connectedPin: Doc<"pins">,
        currentPinPos?: { id: string, x: number, y: number } | null): JSX.Element | null {
        const connectionKey = [pin._id, connectedPin._id].sort().join('-');

        if (!drawnConnections.has(connectionKey) && pin._id !== connectedPin._id) {
            drawnConnections.add(connectionKey)

            const startX = pin.x + pin.width / 2;
            const startY = pin.y + pin.height / 2; // Adjusted for center

            const endX = connectedPin.x + connectedPin.width / 2;
            const endY = connectedPin.y + connectedPin.height / 2; // Adjusted for center

            const deltaY = Math.abs(endY - startY);
            const deltaX = Math.abs(endX - startX);
            const offset = Math.max(deltaY, 100);

            const controlPoint1X = startX + (deltaX / 3);
            const controlPoint1Y = startY + offset;

            const controlPoint2X = endX - (deltaX / 3);
            const controlPoint2Y = endY + offset;

            let origin: 'left' | 'right' | 'neither' = 'neither'
            if (currentPinPos?.id === pin._id) {
                origin = "left"
            }
            if (currentPinPos?.id === connectedPin._id) {
                origin = "right"
            }

            const pathData = `M${origin === 'left' ? (currentPinPos?.x ?? pin.x) + pin.width / 2 : startX} 
                             ${origin === 'left' ? (currentPinPos?.y ?? pin.y) + pin.height / 2 : startY}
                C${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, 
                ${origin === 'right' ? (currentPinPos?.x ?? connectedPin.x) + connectedPin.width / 2 : endX} 
                ${origin === 'right' ? (currentPinPos?.y ?? connectedPin.y) + connectedPin.height / 2 : endY}`;

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