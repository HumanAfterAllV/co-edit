"use client";

import { useState } from "react";
import { useSelf } from "@liveblocks/react/suspense";
import Image from "next/image";
import { z } from "zod";

import { Mail, Share2, Users2 } from "lucide-react"; 

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
                <Button variant="outline" className="border-custom-btn" disabled={currentUserType !== "editor"}>
                    <Share2 className="mr-2 h-4 w-4"/>
                    <p className="mr-1 hidden md:block font-bold">
                        Share
                    </p>
                </Button>
            </DialogTrigger>
            <DialogContent className="border-custom-cards">
                <DialogHeader className="border-b-4 border-black p-6">
                    <DialogTitle className="flex items-center gap-2 text-2xl text-white">
                        <Users2 className="h-8 w-8"/>
                        Share Document
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 p-6">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400"/>
                            <Input 
                                id="email" 
                                type="email"
                                placeholder="Enter email address" 
                                value={email} 
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }} 
                                className="text-black border-4 border-black pl-10 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div>
                        <UserTypeSelector userType={userType as UserType} setUserType={setUserType}/>
                        <Button type="submit" onClick={shareDocumentHandler} className="border-custom-btn" disabled={loading}>
                            {loading ? "Sending..." : "Invite"}
                        </Button>
                    </div>
                </div>
                {errorEmail && (
                    <p className="text-red-500 mt-2">{errorEmail}</p>
                )}
{/*                 {emailNoRegistered && (
                    <p className="text-red-500 mt-2">{emailNoRegistered}</p>
                )} */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">People with access</h3>
                    <div className="rounded-lg border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                </div>
            </DialogContent>
        </Dialog>
    )
}