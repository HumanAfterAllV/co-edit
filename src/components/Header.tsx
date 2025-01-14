
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import AddDocumentBtn from "./AddDocumentBtn"
import Notifications from "./Notifications"
import { SignedIn, UserButton } from "@clerk/nextjs"

export default function Header({userId, email}: AddDocumentBtnProps): React.JSX.Element {
    return(
        <Card className="border-custom-cards mb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <CardTitle>
                    <Link href="/" className="md:flex-1">
                        <Image
                            src="/assets/icons/logo-co_edit.svg"
                            alt="Logo"
                            width={160}
                            height={32}
                            className="hidden md:block"
                        />
                    </Link>            
                </CardTitle>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <AddDocumentBtn userId={userId} email={email}/>
                    <div className="flex items-center gap-2 lg:gap-4 pr-2">
                        <Notifications /> 
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </Card>
    )
}