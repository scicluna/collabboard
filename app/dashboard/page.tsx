import { currentUser } from "@clerk/nextjs";
import BoardSelector from "@/components/client/BoardSelector";
import DashNav from "@/components/client/DashNav";

export default async function Dashboard() {
    const user = await currentUser();
    return (
        <section className='flex flex-col h-full w-full relative'>
            <DashNav />
            <div className="flex sm:flex-row flex-col">
                <BoardSelector userid={user!.id} />
                <div className="p-10">
                    <h1 className="text-5xl font-extrabold">Hello {user?.firstName}!</h1>
                    <p>I'm honestly not sure what to put on the dashboard mainpage. If you have any ideas, please open an issue at <a href="https://github.com/scicluna/collabboard" target="_blank">https://github.com/scicluna/collabboard</a></p>
                    <p>For now, click on the plus to build a new collab board and enjoy!</p>
                </div>
            </div>
        </section>
    )
}