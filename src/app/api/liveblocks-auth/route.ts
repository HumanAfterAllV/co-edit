import { liveblocks } from '@/lib/liveblocks';
import { getUserColor } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: Request) {


    const clerkUser = await currentUser();
    if(!clerkUser) return ("/sign-in");
    
    const { id, firstName, lastName, emailAddresses, imageUrl} = clerkUser;
    
    const user = {
        id: clerkUser.id,
        info: {
            id,
            name: `${firstName} ${lastName}`,
            email: emailAddresses[0].emailAddress,
            avatar: imageUrl,
            color: getUserColor(clerkUser.id),
        }
    }
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: []
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}