'use client'

import { FundRaise } from '@prisma/client'
import { useState } from 'react'
import Btn from '~/components/Button'
import Input from '~/components/Input'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { api } from '~/trpc/react'

export default function DonateDailog({fund}:{fund:FundRaise}) {
  const [input, setInput] = useState(0)
  const {mutate, isPending}  = api.club.donate.useMutation({
    onSuccess(res) {
      window.location.href = res
    }
  }
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Btn label="Donate" className="w-full"/>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Donate to {fund.title}</DialogTitle>
        <Input onChange={(e) => setInput(Number(e.target.value))} label='Amount you want to donate'/>
        <Btn label='Donate' isLoading={isPending} onClick={() =>  mutate({id: fund.id, cid: fund.club_id, amount: Number(input)})}/>
      </DialogContent>
    </Dialog>
  )
}
