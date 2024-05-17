'use client'

import { Grid, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from 'react';
import RegisterDialog from "~/components/RegisterDialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "./ui/button";


type props = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  windowWidth: number;
  storeId?: string;
};

const Sidebar: FC<props> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  windowWidth,
  storeId,
}) => {
  if (windowWidth < 768) {
    if (!isSidebarOpen) return null;

    return (
      <SmallSidebar close={() => setIsSidebarOpen(false)} />
    );
  }

  // TODO: ADD midium

  return (
    <div className="fixed max-w-[200px] w-full h-full">
      <LargeSidebar />
    </div>
  );
};

const SmallSidebar: FC<{ close: () => void; storeId?: string }> = ({
  close,
}) => {
  return (
    <div
      className="z-50 fixed flex items-center top-0 bottom-0 left-0 h-full max-h-screen min-w-[100vw] w-full bg-neutral-700/30 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="flex-1 max-w-[280px] flex justify-start h-full"
        onClick={e => e.stopPropagation()}
      >
        <LargeSidebar />
      </div>
    </div>
  );
};



  function LargeSidebar() {
  const {data: session} = useSession()

 return     <div className="bg-gray-100/20 backdrop-blur-md dark:bg-gray-800 h-full min-h-screen p-4 flex flex-col gap-4">
          {session ?
        (
          <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage alt="@shadcn" src={session.user.image ?? ''} />
{/* @ts-ignore */}
                <AvatarFallback>{session.user.name?.[0]?.toUpperCase()+session.user.name?.[1]?.toUpperCase()}</AvatarFallback>
              </Avatar> 
            <div className="font-medium">{session.user.name}</div>
        </div>
        )
            :<RegisterDialog onCancel={() => {}} onRegister={() => {}}><button>login</button></RegisterDialog>
          }
        <nav className="flex flex-col gap-2">
      <Link href="/">
        <Button className="justify-start gap-2 w-full hover:bg-lime/40" size="sm" variant="ghost">
            <HomeIcon className="w-4 h-4" />
            Home </Button>
      </Link>

      {
        !session?.user.clubId &&
          <Link href="/register-club">
            <Button className="justify-start gap-2 w-full hover:bg-lime/40" size="sm" variant="ghost">
              <Grid className="w-4 h-4" />
              Register for club
            </Button>
          </Link>
      }
      {
        session?.user.clubId &&
          <Link href="/dashboard">
            <Button className="justify-start gap-2 w-full hover:bg-lime/40" size="sm" variant="ghost">
              <Grid className="w-4 h-4" />
              Club Dashboard
            </Button>
          </Link>
      }
        </nav>
<Button className="justify-start gap-2 mt-auto hover:bg-lime/40" size="sm" variant="ghost" onClick={() => signOut()}>
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
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


export default Sidebar
