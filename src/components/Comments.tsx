import { useIsThreadActive } from "@liveblocks/react-lexical";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useThreads } from "@liveblocks/react/suspense"; 

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

const ThreadWrapper = ({thread}: ThreadWrapperProps) => {
    
    const isActive = useIsThreadActive(thread.id);
    
    return(
        <div className="mb-4 last:mb-0">
            <div className={cn(
                "rounded-lg border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all",
                isActive && "translate-x-1 translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                thread.resolved && "opacity-40"
            )}>
                <Thread 
                    thread={thread}
                    className={cn(
                        "comment-thread-border",
                        isActive && "border-none"
                      )} 
                />
            </div>
        </div>
    )
}

export default function Comments(): React.JSX.Element {

    const { threads } = useThreads();

    return(
        <div className="flex flex-col gap-4">
            <Card className="border-custom-cards">
                <CardHeader className="border-b-4 border-black">
                    <CardTitle className="text-white font-bold text-[24px]">
                        New Comment
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="rounded-lg border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Composer/>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-custom-cards">
                <CardHeader className="border-b-4 border-black text-[24px]">
                    <CardTitle className="text-white font-bold">Comments</CardTitle>
                </CardHeader>
                <ScrollArea className="h-[400px]">
                   <CardContent className="p-4">
                        {threads.map((thread) => (
                                <ThreadWrapper key={thread.id} thread={thread}/>
                            ))}
                    </CardContent> 
                </ScrollArea>
            </Card>
        </div>
    )
}