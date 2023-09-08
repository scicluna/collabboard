import { currentUser } from "@clerk/nextjs";
import BoardSelector from "../components/client/BoardSelector";
import DashNav from "../components/client/DashNav";

export default async function Dashboard() {
    const user = await currentUser();
    return (
        <section className='flex flex-col h-full w-full relative'>
            <DashNav />
            <div className="flex sm:flex-row flex-col">
                <BoardSelector userid={user!.id} />
                <h1>{user?.firstName}</h1>
            </div>
        </section>
    )
}