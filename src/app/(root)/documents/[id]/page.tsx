import Collaborative from "@/components/Collaborative";
import { getDocument } from "@/lib/actions/room.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Document({params : { id }}: SearchParamProps): Promise<React.JSX.Element> {

    const clerkUser = await currentUser();

    if(!clerkUser) redirect("/sign-in");

    const room = await getDocument({
        roomId: id,
        userId: clerkUser.emailAddresses[0].emailAddress
    });

    if(!room) redirect("/");

    return( 
        <main className="flex w-full flex-col items-center">
            <Collaborative roomId={id} roomMetadata={room.metadata}/>            
        </main>
    )
}