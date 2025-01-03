import Image from "next/image"

import { useOthers } from "@liveblocks/react/suspense";
 
export default function ActiveCollaborators(): React.JSX.Element {
    const others = useOthers();
    
    const collaborators = others.map((collaborator) => collaborator.info) 
    return(
        <ul className="collaborators-list">
            {collaborators.map(({id, avatar, name, color}) => (
                <li key={id}>
                    <Image
                        src={avatar}
                        alt={name}
                        width={100}
                        height={100}
                        className="inline-block size-8 rounded-full ring-2 ring-dark-100 "
                        style={{border: `3px solid ${color}`}}
                    />
                </li>
            ))}
        </ul>
    )
}