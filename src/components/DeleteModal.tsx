"use client";

import Image from "next/image";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { deleteDocument } from "@/lib/actions/room.actions";

export default function DeleteModal({roomId}: {roomId: string}): React.JSX.Element {

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const deleteDocumentHandler = async() => {
        setLoading(true);
        try{
            await deleteDocument(roomId);
            setOpen(false);
        }
        catch(e){
            console.error("Error deleting document:", e);
        }
        
        setLoading(false);
    }


    return(

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="min-w-9 rounded-xl bg-transparent p-2 transition-all">
                    <Image
                        src="/assets/icons/delete.svg"
                        alt="Delete"
                        width={20}
                        height={20}
                        className="mt-1"
                    />
                </Button>
            </DialogTrigger>
            <DialogContent className="shad-dialog">
                <DialogHeader>
                    <Image
                        src="/assets/icons/delete-modal.svg"
                        alt="Delete"
                        width={48}
                        height={48}
                        className="mb-8" 
                    />
                    <DialogTitle>Delete Document</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this document? This action cannot be
                        undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-5">
                    <DialogClose asChild className="w-full bg-dark-400 text-white">
                        Cancel
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={deleteDocumentHandler}
                        className="gradient-red w-full"
                    >
                        {loading ? "Deleting...": "Delete"}

                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>   
    )
}