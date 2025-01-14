"use client";

import { useState } from "react";
import Link from "next/link";

;
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/Header";
import DeleteModal from "@/components/DeleteModal";
import ToolbarSearch from "@/components/ToolbarSearch";
import { dateConverter } from "@/lib/utils";
import { Button } from "./ui/button";
import AddDocumentBtn from "./AddDocumentBtn";

export default function ClientHome({clerkUser, documents} : any): React.JSX.Element {

    const [view, setView] = useState<"grid" | "list">("grid");
    
    const numberRooms = documents.length;

    return(
        <main className="min-h-screen p-4 md:p-8 bg-toxic-500">
            <Header userId={clerkUser.id} email={clerkUser.email}/>
            <ToolbarSearch view={view} setView={setView} numberRooms={numberRooms}/>
            {documents.length > 0 ? (
                <div className={`${view === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}`}>
                    {documents.map(({id, metadata, createdAt}: any) => (
                        <Card key={id} className="border-custom-cards transition-transform hover:-translate-y-1 mb-3">
                            <CardHeader className="border-b-4 border-black">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl text-white">
                                        {metadata.title}
                                    </CardTitle>
                                    <DeleteModal roomId={id} />
                                </div>
                                <p className="text-sm text-white/80">Created about {dateConverter(createdAt)}</p>
                            </CardHeader>
                            <CardFooter className="border-t-4 border-black p-4">
                                <Link href={`/documents/${id}`} className="w-full">
                                    <Button variant="outline" className="w-full border-4 border-black bg-[#F8FE1F] hover:bg-[#e9ef1a] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        Open
                                    </Button>
                                </Link>
                            </CardFooter> 
                        </Card>
                    ))}
                </div>
            ): (
                <div className="flex items-center justify-center flex-col gap-4">
                    <h1 className="text-black text-4xl font-bold">
                        Create a new document
                    </h1>
                    <AddDocumentBtn userId={clerkUser.id} email={clerkUser.email}/>
                </div>
            )}
            
            {/* {roomDocuments.data.length > 0 ? ( 
                <div className="document-list-container">
                    <div className="document-list-title ">
                        <h3 className="font-bold text-4xl p-5">
                            All documents
                        </h3>
                        <AddDocumentBtn userId={clerkUser.id} email={clerkUser.emailAddresses[0].emailAddress}/>
                    </div>
                    <ul className="document-ul">
                        {roomDocuments.data.map(({id, metadata, createdAt}: any, index: number) => (
                            <li key={id} className="document-list-item" >
                                <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4">
                                    <div className="hidden rounded-md p-2 sm:block ">
                                        <Image
                                            src="/assets/icons/doc.svg"
                                            alt="Document"
                                            width={40}
                                            height={40} 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="line-clamp-1 text-lg font-bold">{metadata.title}</p>
                                        <p className="text-sm font-light">Created about {dateConverter(createdAt)}</p>
                                    </div>
                                </Link>
                                <DeleteModal roomId={id} />
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
            )} */}
        </main>
    )
}