"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { HeadingNode } from "@lexical/rich-text";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin, useEditorStatus } from "@liveblocks/react-lexical";
import { useSyncStatus } from "@liveblocks/react";
import { useThreads } from "@liveblocks/react/suspense";

import { updateDocument } from "@/lib/actions/room.actions";

import Theme from "./plugins/Theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import FloatingToolbar from "./plugins/FloatingToolBar";
import Loader from "../Loader";
import Comments from "../Comments";
import DeleteModal from "../DeleteModal";

import { Card, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import ActiveCollaborators from "../ActiveCollaborators";
import ShareModal from "../ShareModal";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

function Placeholder() {
    return <div className="editor-placeholder">Enter some text...</div>
}

export function Editor({roomId, currentUserType, roomMetadata, users}: EditorProps): React.JSX.Element {

    const status = useEditorStatus();

    const { threads } = useThreads();

    const initialConfig = liveblocksConfig({
        namespace: "Editor",
        nodes: [HeadingNode],
        onError: (error: Error) => {
            console.error(error);
            throw error;
        },
        theme: Theme,
        editable: currentUserType === "editor",
    })


    //Edit document title
    const [documentTitle, setDocumentTitle] = useState<string>(roomMetadata.title);
    const [editing, setEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    
    const updateTitleHandler = async(e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            setLoading(true);

            try{
                if(documentTitle !== roomMetadata.title){
                    const updatedDocument = await updateDocument(roomId, documentTitle);

                    if(updatedDocument){
                        setEditing(false);
                    }
                }
            }
            catch(e){
                console.error(`Error updating document: ${e}`);
            }
        }
        setLoading(false);
    }
    
    useEffect(() => {
        const handlerClickOutside = (e: MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(e.target as Node)){
                setEditing(false);
            }

            updateDocument(roomId, documentTitle);
        }

        document.addEventListener("mousedown", handlerClickOutside);

        return () => {
            document.removeEventListener("mousedown", handlerClickOutside);
        }
    },[roomId, documentTitle])
    
    useEffect(() => {
        if(editing && inputRef.current){
            inputRef.current.focus();
        }
    })

    return(
        <LexicalComposer initialConfig={initialConfig}>
            <div className="space-y-4">
                <Card className="border-custom-cards">
                    <CardHeader className="border-b-4 border-black">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold">
                                <div ref={containerRef} className="flex w-fit items-center justify-center gap-2  p-2 ">
                                    {editing && !loading ? (
                                        <Input
                                            type="text"
                                            value={documentTitle}
                                            ref={inputRef}
                                            placeholder="Enter title"
                                            onChange={(e) => setDocumentTitle(e.target.value)}
                                            onKeyDown={updateTitleHandler}
                                            disabled={!editing}
                                            className="document-title-input placeholder:text-white"
                                        />
                                    ):(
                                        <>
                                            <p className=" text-white">{documentTitle}</p>
                                        </>
                                    )}
                                    {currentUserType === "editor" && !editing && (
                                    <Image
                                            src="/assets/icons/edit.svg"
                                            alt="Edit"
                                            width={24}
                                            height={24}
                                            onClick={() => setEditing(true)}
                                            className="pointer"
                                    /> 
                                    )}
                                    {currentUserType !== "editor" && !editing && (
                                    <p className="view-only-tag">View Only</p>
                                    )}
                                    {loading && (
                                        <p className="text-sm text-yellow-500">Saving...</p>
                                    )}
                                </div>
                            </CardTitle>
                            <div className="flex flex-row gap-2">
                                 <ShareModal 
                                    roomId={roomId} 
                                    collaborators={users} 
                                    creatorId={roomMetadata.creatorId}
                                    currentUserType={currentUserType} 
                                />
                                <ActiveCollaborators/>
                                <SignedOut>
                                    <SignInButton />
                                </SignedOut>
                                <SignedIn>
                                    <UserButton />
                                </SignedIn>
                            </div>
                        </div>

                    </CardHeader>
                </Card>
            </div>
        </LexicalComposer>
    )
}