"use client";

import { useState } from "react";
import { useSelf } from "@liveblocks/react/suspense";
import Image from "next/image";
import { z } from "zod";

import { checkEmailExist, updateDocumentAccess } from "@/lib/actions/room.actions";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./UsertTypeSelector";
import Collaborator from "./Collaborator";
  

export default function ShareModal({roomId, collaborators, creatorId, currentUserType} : ShareDocumentDialogProps): React.JSX.Element {

    const user = useSelf();

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    
    const [email, setEmail] = useState<string>("");
    const [userType, setUserType] = useState<UserType>("viewer");

    const [errorEmail, setErrorEmail] = useState<string>("");
    const [emailNoRegistered, setEmailNoRegistered] = useState<string>("");
    const emailSchema = z.string().email("Please, enter a valid email address...").refine((email) => email.endsWith("@gmail.com"), { message: "Only Gmail and register accounts are allowed" });
    
    const shareDocumentHandler = async() => {
        setErrorEmail("");
/*         setEmailNoRegistered(""); */
        try{
            emailSchema.parse(email);
        }
        catch(error: unknown){
            if (error instanceof z.ZodError) {
                setErrorEmail(error.errors[0].message);
            } else {
                console.error("An unexpected error occurred");
            }
            return;
        }
        if (!email) {
            console.error("Email is null or empty");
            return;
        }
/* 
        const emailExist = await checkEmailExist(email);

        if(!emailExist){
            setEmailNoRegistered("This email is not registered in the platform");
            return;
        } */

        setLoading(true);
        await updateDocumentAccess({ roomId, email, userType: userType as UserType, updatedBy: user.info });
        setLoading(false);
    };

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex flex-row items-center rounded-3xl border-[1px] border-dark-500 shadow-none bg-beige-500" disabled={currentUserType !== "editor"}>
                    <Image
                        src="/assets/icons/share.svg"
                        alt="Share"
                        width={20}
                        height={20}
                        className="min-w-4 md:size-5"
                    />
                    <p className="mr-1 hidden md:block font-bold text-dark-500">
                        Share
                    </p>
                </Button>
            </DialogTrigger>
            <DialogContent className="shad-dialog">
                <DialogHeader>
                    <DialogTitle>Manage who can view this project</DialogTitle>
                    <DialogDescription className="text-neutro-500">
                        Select which users can view and edit this document
                    </DialogDescription>
                </DialogHeader>
                <Label htmlFor="email" className="mt-6 text-dark-500">Email Address</Label>
                <div className="flex items-center gap-3">
                    <div className="flex flex-1 rounded-md bg-dark-1000">
                        <Input 
                            id="email" 
                            type="email"
                            placeholder="Enter email address" 
                            value={email} 
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }} 
                            className="share-input"
                        />
                        <UserTypeSelector userType={userType as UserType} setUserType={setUserType}/>
                    </div>
                    <Button type="submit" onClick={shareDocumentHandler} className="flex flex-row items-center rounded-3xl border-[1px] border-dark-500 shadow-none" disabled={loading}>
                        {loading ? "Sending..." : "Invite"}
                    </Button>
                </div>
                {errorEmail && (
                    <p className="text-red-500 mt-2">{errorEmail}</p>
                )}
{/*                 {emailNoRegistered && (
                    <p className="text-red-500 mt-2">{emailNoRegistered}</p>
                )} */}
                <div className="my-2 space-y-2">
                    <ul className="flex flex-col">
                        {collaborators.map((collaborator) => (
                            <Collaborator
                                key={collaborator.id} 
                                roomId={roomId} 
                                creatorId={creatorId}
                                email={collaborator.email}
                                collaborator={collaborator}
                                user={user.info}
                            />
                        ))}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    )
}