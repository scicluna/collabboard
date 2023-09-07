import { currentUser } from "@clerk/nextjs";
import BoardSelector from "../components/client/BoardSelector";

export default async function Dashboard() {
    const user = await currentUser();
    return (
        <section className='flex h-[90dvh]'>
            <BoardSelector userid={user!.id} />
            <h1>{user?.firstName}</h1>
        </section>
    )
}