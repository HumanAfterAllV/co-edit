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
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import { updateDocument } from "@/lib/actions/room.actions";

import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import Theme from "./plugins/Theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import FloatingToolbar from "./plugins/FloatingToolBar";
import Loader from "../Loader";
import Comments from "../Comments";
import DeleteModal from "../DeleteModal";
import ActiveCollaborators from "../ActiveCollaborators";
import ShareModal from "../ShareModal";

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

    console.log("status:", status);
    return(
        <LexicalComposer initialConfig={initialConfig}>
            <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
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
                                                <p className=" text-white font-bold text-[24px]">{documentTitle}</p>
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
                        <CardContent className="p-4">
                            <div className="mb-4 flex flex-wrap gap-2 border-b-4 border-black pb-4">
                                <div className="flex w-full flex-col md:flex-row justify-between">
                                    <ToolbarPlugin/>
                                    {currentUserType === "editor" && <DeleteModal roomId={roomId}/>}
                                </div>
                            </div>
                            <div className="min-h-[600px] border-4 border-black bg-white p-4 font-mono text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                {status === "not-loaded" || status === "loading" ? <Loader/> : (
                                    <div className="editor-inner">
                                        <RichTextPlugin
                                            contentEditable={
                                                <ContentEditable className="editor-input h-full" />
                                            }
                                            placeholder={<Placeholder />}
                                            ErrorBoundary={LexicalErrorBoundary}
                                        />
                                        {currentUserType === "editor" && <FloatingToolbar/>}
                                        <HistoryPlugin />
                                        <AutoFocusPlugin />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <LiveblocksPlugin>
                        <FloatingComposer className='w-[350px]' />
                        <FloatingThreads threads={threads}/>
                        <Comments/> 
                    </LiveblocksPlugin>
                </div>
            </div>
        </LexicalComposer>
    )
}