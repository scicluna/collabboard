'use client'
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { BoardSelectorProps } from "./BoardSelector";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CreateNewBoard({ userid }: BoardSelectorProps) {
    const newBoardMutation = useMutation(api.boards.newBoard)
    const [modal, setModal] = useState(false)
    const [name, setName] = useState("")

    async function buildNewBoard(e: any) {
        e.preventDefault()
        await newBoardMutation({ userId: userid!, boardName: name })
        setModal(prev => !prev)
        setName("")
    }

    return (
        <div className="relative w-full mb-5 flex sm:flex-row flex-col items-center gap-5 sm:h-[30px]">
            <button className="flex items-center hover:text-gray-400 h-[28px]  rounded-full focus:outline focus:outline-[3px] focus:outline-indigo-300 transition-all duration-15 outline-none" onClick={() => setModal(prev => !prev)}>
                <FontAwesomeIcon icon={faPlus} color="gray" className="text-3xl rounded-full" />
            </button>
            <span>Create a Board!</span>
            {modal &&
                <form className="absolute right-0 h-fit w-full flex gap-3 text-sm sm:text-base justify-around items-center bg-gray-100 shadow-sm shadow-slate-500 p-3 rounded-md"
                    onSubmit={buildNewBoard}>
                    <label htmlFor="boardname" className="">Board Name:</label>
                    <input value={name} onChange={e => setName(e.target.value)} type="text" name="boardname" className="p-1" />
                    <button type="submit" className="text-blue-400 hover:text-blue-300">Create</button>
                    <button type="button" className="text-blue-400 hover:text-blue-300" onClick={() => setModal(prev => !prev)}>
                        <FontAwesomeIcon icon={faX} />
                    </button>
                </form>}
        </div>
    )
}