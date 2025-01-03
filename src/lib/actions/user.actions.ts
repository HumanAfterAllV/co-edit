"use server";

import { clerkClient } from '@clerk/express'
import { parseStringify } from "../utils";


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