"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { createDocument } from "@/lib/actions/room.actions";

import { Button } from "./ui/button";

export default function AddDocumentBtn({userId, email}: AddDocumentBtnProps): React.JSX.Element {
    const router = useRouter();
    const addDocumentHandler = async () => {
        try{
            const room = await createDocument({userId, email});
            if(room) {
                router.push(`/documents/${room.id}`);
            }
        }
        catch(error){
            console.error(error);
        }
    };
    
    return(
        <Button type="submit" onClick={addDocumentHandler} className="border-custom-btn">
            <Image
                src="/assets/icons/add.svg"
                alt="Add Document"
                width={24}
                height={24}
            />
            <p className="hidden sm:block font-bold">New document</p>
        </Button>
    )
}