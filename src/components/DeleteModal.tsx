"use client";

import { useState } from "react";

import { deleteDocument } from "@/lib/actions/room.actions";

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
import { AlertTriangle, Trash2 } from "lucide-react";


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
                <Button className="border-4 border-black bg-white hover:bg-red-100 text-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Trash2 className="h-4 w-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="border-custom-cards space-y-3">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-white">Delete Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4p-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full border-4 border-black bg-yellow-500 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)">
                           <AlertTriangle className="h-6 w-6 text-black"/> 
                        </div>
                        <DialogDescription className="text-base text-white">
                            ¿Are you sure you want to delete this document? This action cannot be undone.
                        </DialogDescription>
                    </div>
                </div>
                <DialogFooter className="flex flex-row items-center w-full justify-center border-t-4 border-black p-6">
                    <DialogClose asChild>
                        <Button className="border-custom-btn">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={deleteDocumentHandler}
                        className="border-4 border-black bg-white hover:bg-gray-100 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                        {loading ? "Deleting...": "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>   
    )
}