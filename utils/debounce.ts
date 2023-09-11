"use client"
import { useRef } from "react";

export function useDebounce(callback: Function, delay: number) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return (...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            await callback(...args);
        }, delay);
    };
}