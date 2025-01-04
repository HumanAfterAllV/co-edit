import Collaborative from "@/components/Collaborative";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Document({params : { id }}: SearchParamProps): Promise<React.JSX.Element> {

    const clerkUser = await currentUser();

    if(!clerkUser) redirect("/sign-in");

    const room = await getDocument({
        roomId: id,
        userId: clerkUser.emailAddresses[0].emailAddress,
        
    });

    if(!room) redirect("/");

    const userIds = Object.keys(room.usersAccesses)
    const users = await getClerkUser({userIds});

    const userData = users.map((user: User) => ({
        ...user,
        userType: room.usersAccesses[user.email]?.includes("room:write") ? "editor" : "viewer",

    }))

    const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer';

    console.log(userIds, users, userData, currentUserType)
    return( 
        <main className="flex w-full flex-col items-center">
            <Collaborative roomId={id} roomMetadata={room.metadata} users={userData} currentUserType={currentUserType}/>            
        </main>
    )
}