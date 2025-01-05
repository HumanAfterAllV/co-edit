"use client"

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    ClientSideSuspense,
  } from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import { getClerkUser, getDocumentsUser } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";

export default function Provider({children}: {children: ReactNode}): React.JSX.Element {

    const { user: clerkUser } = useUser();

    return(
        <LiveblocksProvider 
            authEndpoint="/api/liveblocks-auth" 
            resolveUsers={async ({ userIds }) => {
                const users = await getClerkUser({userIds})

                return users;
            }}
            resolveMentionSuggestions={async ({text, roomId}) => {
                const roomUsers = await getDocumentsUser({roomId, currentUser: clerkUser?.emailAddresses[0].emailAddress , text});

                return roomUsers;
            }}
        >
            <ClientSideSuspense fallback={<Loader />}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    )
}