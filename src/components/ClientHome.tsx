"use client";

import { useState } from "react";
import Link from "next/link";

import { dateConverter } from "@/lib/utils";
;
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "./ui/button";

import Header from "@/components/Header";
import DeleteModal from "@/components/DeleteModal";
import ToolbarSearch from "@/components/ToolbarSearch";
import AddDocumentBtn from "./AddDocumentBtn";

export default function ClientHome({clerkUser, documents} : any): React.JSX.Element {

    const [view, setView] = useState<"grid" | "list">("grid");

    const [searchTerm, setSearchTerm] = useState<string>("");
    
    const numberRooms = documents.length;

    const filteredDocuments = documents.filter(({metadata}: any) => metadata.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return(
        <main className="min-h-screen p-4 md:p-8 bg-toxic-500">
            <Header userId={clerkUser.id} email={clerkUser.email}/>
            <ToolbarSearch view={view} setView={setView} numberRooms={numberRooms} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            {filteredDocuments.length > 0 ? (
                <div className={`${view === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}`}>
                    {filteredDocuments.map(({id, metadata, createdAt}: any) => (
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

        </main>
    )
}