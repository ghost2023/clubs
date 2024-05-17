import { Club, FundRaise, Post } from "@prisma/client"
import MainLayout from "~/components/MainLayout"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { getServerAuthSession } from "~/server/auth"
import { db } from "~/server/db"
import DonateDailog from "./DonateDailog"

export default async function Component() {
  const session = await getServerAuthSession()
  const posts = await db.post.findMany({
    include: {
      club: true
    }
  })

  const fundraising = await db.fundRaise.findMany({
    include: {
      club: true,
    },
  })

  const clubs = await db.club.findMany()
  
  return (
    <MainLayout>

      <div className="flex gap-3 bg-gray-100 ">
        <div className="flex flex-col py-8 gap-4 overflow-auto px-7 max-w-3xl w-full ">
          {fundraising.map(post => <FundCard fund={post}/> )}
          {posts.map(post => <PostCard post={post}/> )}
        </div>

        <div className="flex-col py-8 gap-4 overflow-auto hidden sm:flex">
        <div className="font-medium">Suggested for you</div>
        <div className="flex flex-col gap-4">
            {clubs.map(club => <ClubCard club={club} />) }
        </div>
      </div>
      </div>
    </MainLayout> 
  )
}

const ClubCard = ({club}: {club: Club}) => {
         return <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage alt="@shadcn" src={'/uploads/' + club.image}/>
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{club.name}</div>
            </div>
          </div>
}


const FundCard = async ({fund}:{fund: FundRaise & {club: Club}}) => {
  const raised = await db.donation.aggregate({
    _sum: {
      amount: true
    },
    where: {
      fund_raise_id: fund.id
    }
  })

          return <div className="rounded-lg shadow-xl border-lg bg-white ">
            <div className="flex items-center gap-2 p-4">
              <Avatar className="w-8 h-8">
                <AvatarImage alt="@shadcn" src={'/uploads/' + fund.club.image}/>
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div className="font-medium">{fund.club.name}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm"> • 2h</div>
            </div>
            <div>
              <img
                alt="Cafe Interior"
                className="rounded-lg object-cover w-full max-w-xl "
                height={400}
                src={`/uploads/${fund.images}`}
                style={{
                  aspectRatio: "600/400",
                  objectFit: "cover",
                }}
              />
              <p className="p-4 text-lg ">{fund.description}</p>
      <div className="flex px-7 justify-evenly py-5">
        <div>
          <div className="text-xl font-semibold">Goal</div>
          <p>{fund.goal.toFixed(2)}ETB</p>
        </div>

        <div>
          <div className="text-xl font-semibold">Raised</div>
          <p>{raised._sum.amount?.toFixed(2) ?? 0}ETB</p>
        </div>
      </div>
      <div className="mb-6 px-4 flex justify-stretch"><DonateDailog fund={fund}/></div>
            </div>
          </div>
}

const PostCard = ({post}:{post: Post & {club: Club}}) => {

          return <div className="rounded-lg shadow-xl border-lg bg-white ">
            <div className="flex items-center gap-2 p-4">
              <Avatar className="w-8 h-8">
                <AvatarImage alt="@shadcn" src={'/uploads/' + post.club.image}/>
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div className="font-medium">{post.club.name}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm"> • 2h</div>
            </div>
            <div>
              <img
                alt="Cafe Interior"
                className="rounded-lg object-cover w-full max-w-xl  "
                height={400}
                src={`/uploads/${post.images[0]}`}
                style={{
                  aspectRatio: "600/400",
                  objectFit: "cover",
                }}
              />
              <p className="p-4 text-lg ">{post.Caption}</p>
            </div>
          </div>
}
