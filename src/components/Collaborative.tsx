"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'

import { Editor } from "@/components/editor/NewEditor";
import Loader from "./Loader";

export default function Collaborative({roomId, roomMetadata, users, currentUserType} : CollaborativeRoomProps): React.JSX.Element {

    return(
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <Editor roomId={roomId} currentUserType={currentUserType} roomMetadata={roomMetadata} users={users}/>
            </ClientSideSuspense>
        </RoomProvider>
    )
}