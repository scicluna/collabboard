'use client'
import { MouseEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type TrashBoardProps = {
    userid: string
    boardid: Id<"boards">
}

export default function TrashBoard({ userid, boardid }: TrashBoardProps) {
    const deleteBoard = useMutation(api.boards.deleteBoard)

    async function initDeleteBoard(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        await deleteBoard({ userId: userid, boardId: boardid })
    }

    return (
        <button onClick={initDeleteBoard} className="absolute bottom-0 right-0">
            <FontAwesomeIcon icon={faTrash} className="px-1" />
        </button>
    )
}