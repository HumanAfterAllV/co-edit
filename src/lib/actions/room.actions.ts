"use server";

import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';

import { liveblocks } from '../liveblocks'; // Ensure this import is correct and the module exists
import { parseStringify } from '../utils';

export const createDocument = async({ userId, email }: CreateDocumentParams) => {
    const roomId = nanoid();

    try{
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled",
        }

        const usersAccesses: RoomAccesses = {
            [email]: ["room:write"],
        }
        
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses: usersAccesses,
            defaultAccesses: [],
        });

        revalidatePath("/");
        return parseStringify(room);
    }
    catch(error){
        console.error(`Error creating a room: ${error}`);
    }
}

export const getDocument = async ({roomId, userId} : {roomId: string, userId: string}) => {
    try{
        const room = await liveblocks.getRoom(roomId);
    
/*         const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    
        if(!hasAccess) {
            throw new Error("You don't have access to this document");
        } */
    
        return parseStringify(room);
    }
    catch(error){
        console.error(`Error getting a document: ${error}`);
    }
}

export const updateDocument = async (roomId: string, title: string) => {
    try{
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            }
        });
        revalidatePath("/documents/${roomId}");
        return parseStringify(updatedRoom);
    }
    catch(error){
        console.error(`Error updating a document: ${error}`);
    }
}

export const getDocuments = async (email: string) => {
    try{
        const rooms = await liveblocks.getRooms();
        const filteredRooms = rooms.data.filter((room: any) => room.metadata.email === email);

        return { data: filteredRooms };
    }
    catch(error){
        console.error(`Error happened while getting rooms: ${error}`);
        return { data: [] };
    }
}