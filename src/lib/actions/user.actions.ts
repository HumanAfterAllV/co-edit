"use server";

import { clerkClient } from '@clerk/nextjs/server';
import { parseStringify } from "../utils";
import { liveblocks } from '../liveblocks';


export const getClerkUser = async ( {userEmails} : {userEmails : string[]}) => {
    try{
        
        const client = await clerkClient();

        const users = await client.users.getUserList({
            emailAddress: userEmails
        })
        
        const formattedUsers = users.data.map((user: any) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.emailAddresses[0].emailAddress ?? "",
            avatar: user.imageUrl,
        }));

        const sortedUsers = userEmails.map((email)  => formattedUsers.find((user: any) => user.email === email));
        console.log({ users: formattedUsers, userEmails, sortedUsers });

        return parseStringify(sortedUsers);
    }
    catch(error){
        console.error(`Error getting clerk user: ${error}`);
    }
}

export const getDocumentsUser = async ({roomId, currentUser, text} : {roomId : string, currentUser : string, text: string}) => {
    try{
        const room = await liveblocks.getRoom(roomId);

        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        if(text.length){
            const lowerCaseText = text.toLowerCase();

            const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText));

            return parseStringify(filteredUsers);
        }

        return parseStringify(users);
    }
    catch(error){
        console.error(`Error getting documents user: ${error}`);
    }
}

