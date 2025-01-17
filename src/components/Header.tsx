
import Image from "next/image"
import Link from "next/link"
import { SignedIn, UserButton } from "@clerk/nextjs"

import { Card, CardTitle } from "./ui/card"

import AddDocumentBtn from "./AddDocumentBtn"
import Notifications from "./Notifications"

export default function Header({userId, email}: AddDocumentBtnProps): React.JSX.Element {
    return(
        <Card className="border-custom-cards mb-4">
            <div className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="flex items-center justify-between sm:justify-start sm:flex-1">
                        <Link href="/" className="block">
                            <Image
                                src="/assets/images/logo-co_edit.png"
                                alt="Logo"
                                width={120}
                                height={24}
                                className="block sm:hidden"
                            />
                        </Link>            
                        <Link href="/" className="block">
                            <Image
                                src="/assets/images/logo-co_edit.png"
                                alt="Logo"
                                width={160}
                                height={32}
                                className="hidden sm:block"
                            />
                        </Link>            
                    </CardTitle>
                    <div className="flex items-center justify-between sm:items-end gap-4">
                        <div className="order-1 sm:order-none">
                            <AddDocumentBtn userId={userId} email={email}/>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Notifications /> 
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}