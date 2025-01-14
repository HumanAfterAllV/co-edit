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

    
    const userEmails = Object.keys(room.usersAccesses)
    const users = await getClerkUser({userEmails});
    
    const userData = users.map((user: User) => ({
        ...user,
        userType: room.usersAccesses[user.email]?.includes("room:write") ? "editor" : "viewer",
    }));
    

    const emailAddress = clerkUser.emailAddresses[0]?.emailAddress;

    if (!emailAddress || !room.usersAccesses[emailAddress]) {
        console.error("User email or access not found:", emailAddress);
        redirect("/");
    }

    const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer';

    return( 
        <main className="min-h-screen bg-toxic-500 p-4 md:p-8">
            <Collaborative roomId={id} roomMetadata={room.metadata} users={userData} currentUserType={currentUserType}/>            
        </main>
    )
}

