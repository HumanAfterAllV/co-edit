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
    catch(error: unknown){
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
    catch(error: unknown){
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
        revalidatePath(`/documents/${roomId}`);
        return parseStringify(updatedRoom);
    }
    catch(error: unknown){
        console.error(`Error updating a document: ${error}`);
    }
}

export const getDocuments = async (email: string) => {
    try{
        const rooms = await liveblocks.getRooms();
        const filteredRooms = rooms.data.filter((room: any) => room.metadata.email === email);

        return { data: filteredRooms };
    }
    catch(error: unknown){
        console.error(`Error happened while getting rooms: ${error}`);
        return { data: [] };
    }
}

export const updateDocumentAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
    
    try {
        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType,
        };

        const room = await liveblocks.updateRoom(roomId, { usersAccesses });

        if (room) {
            const notificationId = nanoid();

            await liveblocks.triggerInboxNotification({
                userId: email,
                kind: "$documentAccess",
                subjectId: notificationId,
                activityData: {
                    userType,
                    title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
                    updatedBy: updatedBy.name,
                    avatar: updatedBy.avatar,
                    email: updatedBy.email,
                },
                roomId,
            })
        }

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(room);
    } 
    catch (error: unknown) {
        console.error(`Error updating document access: ${error}`);
        throw error;
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
    catch(error: unknown){
        console.error(`Error removing collaborator: ${error}`);
    }
}

export const deleteDocument = async (roomId: string) => {
    try{
        await liveblocks.deleteRoom(roomId);
        revalidatePath("/");
        redirect("/");
    }
    catch(error: unknown){
        console.error(`Error deleting document: ${error}`);
    }
}

export const checkEmailExist = async (email: string) => {
    try {
        const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`)
        if(!response.ok) throw new Error("Error checking email");

        const data = await response.json();
        return data.exists;
    } 
    catch (error: unknown) {
        console.error(`Error checking email: ${error}`);
        return false;
    }
}