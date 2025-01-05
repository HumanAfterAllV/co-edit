"use server";

import { clerkClient } from '@clerk/clerk-sdk-node'
import { parseStringify } from "../utils";
import { liveblocks } from '../liveblocks';


export const getClerkUser = async ( {userIds} : {userIds : string[]}) => {
    try{
        const {data} = await clerkClient.users.getUserList({
            emailAddress: userIds
        });

        const users = data.map((user: any) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        })) 

        const sortedUsers = userIds.map((email)  => users.find((user: any) => user.email === email));

        return parseStringify(sortedUsers);
    }
    catch(error){
        console.error(`Error getting clerk user: ${error}`);
    }
}

export const getDocumentsUser = async ({roomId, currentUser, text} : {roomId : string, currentUser : string | undefined, text: string}) => {
    try{
        const room = await liveblocks.getRoom(roomId);
        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        if(text.length){
            const lowerCaseText = text.toLowerCase();

            const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText));

            return parseStringify(filteredUsers);
        }
    }
    catch(error){
        console.error(`Error getting documents user: ${error}`);
    }
}