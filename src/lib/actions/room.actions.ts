"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';

import { liveblocks } from '../liveblocks'; // Ensure this import is correct and the module exists
import { getAccessType, parseStringify } from '../utils';

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
            usersAccesses,
            defaultAccesses: ["room:write"],
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
    
        const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    
        if(!hasAccess) {
            throw new Error("You don't have access to this document");
        }
    
        return parseStringify(room);
    }
    catch(error){
        console.error(`Error getting a document: ${error}`);
        redirect("/");
    }
}

export const updateDocument = async (roomId: string, title: string) => {
    try{
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            }
        });
        revalidatePath(`/documents/${roomId}`);
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

export const updateDocumentAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
    if (!email) {
        console.error("Email is null or empty");
        throw new Error("Invalid email address");
    }
    if (!roomId) {
        console.error("Room ID is missing");
        throw new Error("Invalid room ID");
    }
    if (!userType) {
        console.error("User type is missing");
        throw new Error("Invalid user type");
    }

    console.log("Input parameters:", { roomId, email, userType, updatedBy });

    try {
        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType,
            
        };

        console.log("Users accesses:", usersAccesses);
        console.log("Access type for userType:", { userType });

        const room = await liveblocks.updateRoom(roomId, { usersAccesses });

        if (room) {
            console.log("Room updated successfully:", room);
        }

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(room);
    } catch (error) {
        console.error(`Error updating document access: ${error}`);
        throw error; // Lanza el error para que pueda manejarse externamente
    }
};

export const removeCollaborator = async ({roomId, email}: {roomId: string, email: string}) => {
    try{
        const room = await liveblocks.getRoom(roomId);

        if(room.metadata.email === email){
            throw new Error("You can't remove the creator of the document");
        }

        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: null,
            }
        })

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(updatedRoom);
    }
    catch(error){
        console.error(`Error removing collaborator: ${error}`);
    }
}

export const deleteDocument = async (roomId: string) => {
    try{
        await liveblocks.deleteRoom(roomId);
        revalidatePath("/");
        redirect("/");
    }
    catch(error){
        console.error(`Error deleting document: ${error}`);
    }
}