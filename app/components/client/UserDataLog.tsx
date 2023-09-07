"use client"
import { useUser } from "@clerk/nextjs";

export default function UserDataLog() {
    const { isSignedIn, user, isLoaded } = useUser();

    if (!isLoaded) {
        return null;
    }

    if (isSignedIn) {
        console.log(user)
    }

    return <></>
}
