"use client";

import { useState } from "react";
import { useSelf } from "@liveblocks/react/suspense";
import Image from "next/image";

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
    
    const shareDocumentHandler = async()=> {

    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button className="gradient-blue flex h-9 gap-1 px-4" disabled={currentUserType === "viewer"}>
                    <Image
                        src="/assets/icons/share.svg"
                        alt="Share"
                        width={20}
                        height={20}
                        className="min-w-4 md:size-5"
                    />
                    <p className="mr-1 hidden md:block">
                        Share
                    </p>
                </Button>
            </DialogTrigger>
            <DialogContent className="shad-dialog">
                <DialogHeader>
                    <DialogTitle>Manage who can view this project</DialogTitle>
                    <DialogDescription>
                        Select which users can view and edit this document
                    </DialogDescription>
                </DialogHeader>
                <Label htmlFor="email" className="mt-6 text-blue-100">Email Address</Label>
                <div className="flex items-center gap-3">
                    <div className="flex flex-1 rounded-md bg-dark-1000">
                        <Input 
                            id="email" 
                            placeholder="Enter email address" 
                            value={email} onChange={(e) => setEmail(e.target.value)} 
                            className="share-input"
                        />
                        <UserTypeSelector userType={userType} setUserType={setUserType}/>
                    </div>
                    <Button type="submit" onClick={shareDocumentHandler} className="gradient-blue flex h-9 gap-1 px-5" disabled={loading}>
                        {loading ? "Sending..." : "Invite"}
                    </Button>
                </div>
                <div className="my-2 space-y-2">
                    <ul className="flex flex-col">
                        {collaborators.map((collaborator) => (
                            <Collaborator
                                key={collaborator.id} 
                                roomId={roomId} 
                                creatorId={creatorId}
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