import { redirect } from "next/navigation"
import MainLayout from "~/components/MainLayout"
import { Avatar, AvatarImage } from "~/components/ui/avatar"
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { getServerAuthSession } from '~/server/auth'
import { db } from '~/server/db'
import { Topbar } from "./Topbar"

export default async function Page ()  {
  const session = await getServerAuthSession()
  if(!session || !session.user?.clubId) redirect('/')

  const club = await db.club.findUnique({
    where: {
      id: Number(session?.user.clubId)
    }
  })
  
  const postsCount = await db.post.count({
    where: {
      club_id: Number(session?.user.clubId ?? '')
    }
  })

  const eventsCount = await db.event.count({
    where: {
      club_id: Number(session?.user.clubId ?? '')
    }
  })

  const membersCount = await db.clubParticipant.count({
    where: {
      club_id: Number(session?.user.clubId ?? '')
    }
  })

  const topMembers = await db.clubParticipant.findMany({
    where: {
      club_id: Number(session?.user.clubId ?? '')
    },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    },
    take: 3,
    orderBy: {
      created_at: 'desc'
    }
  })

  const topEvents = await db.event.findMany({
    where: {
      club_id: Number(session?.user.clubId ?? '')
    },
    take: 3,
    orderBy: {
      created_at: 'desc'
    }
  })



  return (
    <MainLayout><div className="flex flex-col gap-4 px-4">
      <Topbar club={{id: club?.id ??0, name: club?.name??''}}/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="rounded-lg shadow-lg">
          <CardHeader className="p-4">
            <div className="text-xl font-bold">Club Overview</div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{membersCount}</div>
                <div className="text-gray-500 dark:text-gray-400">Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{eventsCount}</div>
                <div className="text-gray-500 dark:text-gray-400">Events</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{postsCount}</div>
                <div className="text-gray-500 dark:text-gray-400">Posts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-lg shadow-lg">
          <CardHeader className="p-4">
            <div className="text-xl font-bold">Upcoming Events</div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2">
                <div className="text-2xl font-bold">12</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">May</div>
              </div>
              <div>
                <div className="font-medium">Sports Club Picnic</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">12:00 PM - 4:00 PM</div>
              </div>
              <Button className="ml-auto" size="icon" variant="ghost">
                <CalendarIcon className="w-4 h-4" />
                <span className="sr-only">Add to calendar</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2">
                <div className="text-2xl font-bold">20</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">May</div>
              </div>
              <div>
                <div className="font-medium">Sports Club Tournament</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">9:00 AM - 5:00 PM</div>
              </div>
              <Button className="ml-auto" size="icon" variant="ghost">
                <CalendarIcon className="w-4 h-4" />
                <span className="sr-only">Add to calendar</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-lg shadow-lg">
          <CardHeader className="p-4">
            <div className="text-xl font-bold">New Club Members</div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-4">
            {topMembers.map(mem => <div key={mem.user_id} className="flex items-center gap-4">
              <Avatar className="w-10 h-10 border">
                <AvatarImage alt="@username" src={mem.user.image??''}/>
              </Avatar>
              <div>
                <div className="font-medium">{mem.user.name}</div>
              </div>
            </div>) }
          </CardContent>
        </Card>
        <Card className="rounded-lg shadow-lg">
          <CardHeader className="p-4">
            <div className="text-xl font-bold">Club Activity</div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">150</div>
                <div className="text-gray-500 dark:text-gray-400">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold">250</div>
                <div className="text-gray-500 dark:text-gray-400">Comments</div>
              </div>
              <div>
                <div className="text-2xl font-bold">1,500</div>
                <div className="text-gray-500 dark:text-gray-400">Likes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div></MainLayout>
  )
}

function BookmarkIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
}


function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function CompassIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}


function HomeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}


function ListIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}


function MessagesSquareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
    </svg>
  )
}


function MoveHorizontalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  )
}


function SignalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 4v16" />
    </svg>
  )
}


function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
