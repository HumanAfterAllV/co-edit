import Image from "next/image";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

import Header from "@/components/Header";
import AddDocumentBtn from "@/components/AddDocumentBtn";
import { redirect } from "next/navigation";
import { getDocuments } from "@/lib/actions/room.actions";
import Link from "next/link";


export default async function Home(): Promise<React.JSX.Element> {
    const clerkUser = await currentUser();

    if(!clerkUser) redirect("/sign-in");

    const roomDocuments = await getDocuments(clerkUser.emailAddresses[0].emailAddress);

    return(
        <main className="home-container">
            <Header className="sticky top-0 left-0">
                <div className="flex items-center gap-2 lg:gap-4 ">
                    Notification
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </Header>
            {roomDocuments.data.length > 0 ? (
                <div className="document-list-container ">
                    <div className="document-list-title">
                        <h3 className="flex items-center gap-2 lg:gap-4">
                            All documents
                        </h3>
                        <AddDocumentBtn userId={clerkUser.id} email={clerkUser.emailAddresses[0].emailAddress}/>
                    </div>
                    <ul className="document-ul">
                        {roomDocuments.data.map(({id, metadata, createdAt}: any) => (
                            <li key={id} className="document-list-item">
                                <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4">
                                    
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ): (
                <div className="document-list-empty">
                    <Image
                        src="/assets/icons/doc.svg"
                        alt="Document"
                        width={40}
                        height={40}
                        className="mx-auto"
                    />
                    <AddDocumentBtn userId={clerkUser.id} email={clerkUser.emailAddresses[0].emailAddress}/>
                </div>
            )}
        </main>
    )
}