import Image from "next/image";

export default function Loader(): React.JSX.Element {
    return(
        <div className="loader">
            <Image
                src="/assets/icons/loader.svg"
                alt="Loader"
                width={32}
                height={32}
                className="animate-spin"
            />
        </div>
    )
}