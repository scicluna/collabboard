import Board from "@/components/client/Board";
import { currentUser } from "@clerk/nextjs";

export default async function BoardPage({ params }: { params: { boardid: string } }) {
    const user = await currentUser();
    const { boardid } = params;


    return (
        <Board boardid={boardid} userid={user!.id!} />
    )
}