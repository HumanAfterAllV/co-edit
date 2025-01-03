"use client"

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    ClientSideSuspense,
  } from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import { getClerkUser } from "@/lib/actions/user.actions";

export default function Provider({children}: {children: ReactNode}): React.JSX.Element {
    return(
        <LiveblocksProvider 
            authEndpoint="/api/liveblocks-auth" 
            resolveUsers={async ({ userIds }) => {
                const users = await getClerkUser({userIds})

                return users;
            }}
        >
            <ClientSideSuspense fallback={<Loader />}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    )
}