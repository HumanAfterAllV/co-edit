
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { getDocuments } from "@/lib/actions/room.actions";import { dateConverter } from "@/lib/utils";

import ClientHome from "@/components/ClientHome";


export default async function Home(): Promise<React.JSX.Element> {
    const clerkUser = await currentUser();

    if(!clerkUser) redirect("/sign-in");

    const roomDocuments = await getDocuments(clerkUser.emailAddresses[0].emailAddress);

    return(
        <ClientHome
            documents={roomDocuments.data}
            clerkUser={{id: clerkUser.id, email: clerkUser.emailAddresses[0].emailAddress}}
        />
    )
}