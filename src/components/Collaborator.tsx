"use client";

import Image from "next/image";
import { useState } from "react";

import { removeCollaborator, updateDocumentAccess } from "@/lib/actions/room.actions";

import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

import UserTypeSelector from "./UsertTypeSelector";

export default function Collaborator({roomId, creatorId, collaborator, user, email}: CollaboratorProps): React.JSX.Element {

    const [userType, setUserType] = useState<UserType>(collaborator.userType || "viewer");
    const [loading, setLoading] = useState<boolean>(false);

    const shareDocumentHandler = async(type: string) => {
        setLoading(true);

        await updateDocumentAccess({roomId, email, userType: type as UserType, updatedBy: user});
        
        setLoading(false);
    }
    const removerCollaboratorHandler = async(email: string) => {
        setLoading(true);

        await removeCollaborator({roomId, email})

        setLoading(false);
    }
    return(
        <li className="flex items-center justify-between gap-2 py-3">
            <div className="flex gap-2">
                <Image
                    src={collaborator.avatar}
                    alt={collaborator.name}
                    width={36}
                    height={36}
                    className="size-9 rounded-full"
                />
                <div>
                    <p className="line-clamp-1 text-sm font-bold leading-4 text-dark-500">
                        {collaborator.name}
                        <span className="text-10-regular pl-2 text-neutro-500">
                            {loading && "loading..."}
                        </span>
                    </p>
                    <p className="text-sm font-light text-neutro-500">{collaborator.email}</p>
                </div>
            </div>
            {creatorId === collaborator.id ? (
                <p className="text-sm text-black">Owner</p>
            ):(
                <div className="flex items-center ">
                    <UserTypeSelector 
                        userType={userType as UserType} 
                        setUserType={setUserType || "viewer"}
                        onClickHandler={shareDocumentHandler}
                    />
                    <Button type="button" onClick={() => removerCollaboratorHandler(collaborator.email)} className="text-red-500 shadow-none">
                        <Trash2 className="h-10 w-10"/>
                    </Button>
                </div>
            )}
        </li>
    )
}