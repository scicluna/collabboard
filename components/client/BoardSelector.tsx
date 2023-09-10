"use client"
import CreateNewBoard from "./CreateNewBoard";
import TrashBoard from "./TrashBoard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export type BoardSelectorProps = {
    userid: string
}

export default function BoardSelector({ userid }: BoardSelectorProps) {
    const boards = useQuery(api.boards.getBoards, { userId: userid! })
    return (
        <section className="h-[90dvh] sm:w-1/4 w-full p-4 relative shadow-sm shadow-gray-300 overflow-auto">
            <CreateNewBoard userid={userid} />
            <div className="flex flex-col gap-4">
                {boards && boards.length > 0 ? boards.map(board => (
                    <div className="relative" key={board._id}>
                        <a href={`/board/${board._id}`}>
                            <div className="flex justify-center items-center w-full h-24 bg-orange-100 shadow-sm shadow-gray-400">
                                <p className="font-extrabold">{board.boardName}</p>
                            </div>
                        </a>
                        <TrashBoard userid={userid} boardid={board._id} />
                    </div>
                )) : boards && boards.length < 1 ? <p>There are no boards yet...</p> : <p>Loading...</p>
                }
            </div>
            {/* Eventually put a skeleton loading frame in place of "Loading..." */}
        </section>
    )
}