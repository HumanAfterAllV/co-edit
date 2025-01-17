"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { useInboxNotifications, useUnreadInboxNotificationsCount } from "@liveblocks/react/suspense";
import { InboxNotification, InboxNotificationList, LiveblocksUIConfig } from "@liveblocks/react-ui";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function Notifications(): React.JSX.Element {

    const { inboxNotifications } = useInboxNotifications();
    const { count } = useUnreadInboxNotificationsCount();

    const unreadNotifications = inboxNotifications.filter((notification) => !notification.readAt);

    return (
        <Popover>
            <PopoverTrigger className="relative flex size-10 items-center justify-center rounded-lg">
                <Image
                    src="/assets/icons/bell.svg"
                    alt="Notifications"
                    width={24}
                    height={24}

                />
                {count > 0 && (
                    <div className="absolute top-2 right-2 z-20 size-2 rounded-full bg-toxic-500">
                        
                    </div>
                )}
            </PopoverTrigger>
            <PopoverContent align="end" className="border-custom-cards w-[460px]">
                <LiveblocksUIConfig
                    overrides={{
                        INBOX_NOTIFICATION_TEXT_MENTION : (user: ReactNode) => (
                            <>{user} mention you.</>
                        )
                    }}
                >
                    <InboxNotificationList>
                        {unreadNotifications.length <= 0 && (
                            <p className="py-2 text-center text-white">
                                No new notifications
                            </p>
                        )}
                        {unreadNotifications.length > 0 && unreadNotifications.map((notification) => (
                            <InboxNotification 
                                key={notification.id} 
                                inboxNotification={notification}
                                className=" bg-purple-500 text-white"
                                href={`/documents/${notification.roomId}}`}
                                showActions={false}
                                kinds={{
                                    thread: (props) => (
                                        <InboxNotification.Thread {...props}
                                            showActions={false}
                                            showRoomName={false}
                                        />
                                    ),
                                    textMention: (props) => (
                                        <InboxNotification.TextMention {...props}
                                            showRoomName={false}
                                        />
                                    ),
                                    $documentAccess: (props) => (
                                        <InboxNotification.Custom {...props}
                                            title={props.inboxNotification.activities[0].data.title}
                                            aside={
                                                <InboxNotification.Icon className="bg-transparent">
                                                    <Image
                                                        src={props.inboxNotification.activities[0].data.avatar as string || ""}
                                                        alt="Avatar"
                                                        width={36}
                                                        height={36}
                                                        className="rounded-full"
                                                    />
                                                </InboxNotification.Icon>
                                            }
                                        >
                                            {props.children}
                                        </InboxNotification.Custom>
                                    )
                                }}
                            />
                        ))}
                        
                    </InboxNotificationList>
                </LiveblocksUIConfig>
            </PopoverContent>
        </Popover>

    )
}