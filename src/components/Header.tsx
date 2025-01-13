import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function Header({children, className}: HeaderProps): React.JSX.Element {
    return(
        <div className={cn("header", className)}>
            <Link href="/" className="md:flex-1">
                <Image
                    src="/assets/icons/logo-co_edit.svg"
                    alt="Logo"
                    width={160}
                    height={32}
                    className="hidden md:block"
                />
            </Link>            
            {children}

        </div>
    )
}