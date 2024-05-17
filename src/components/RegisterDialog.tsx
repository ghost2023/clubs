'use client'
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './ui/dialog';

type Props = {
  onCancel: () => void;
  onRegister: () => void;
  children: React.ReactNode
}

export default function RegisterDialog({onRegister, onCancel, children}:Props) {
  const [open, setOpen] = useState(false)

  const {mutate} = useMutation({
    mutationFn: async () =>signIn('google'),
    onSuccess: () => {
      onRegister()
    }
  })

  return (
    <Dialog open={open} onOpenChange={o => {
      if(o) onCancel()
          return setOpen(o);
      }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Join us
        </DialogTitle>
        <DialogDescription className='text-xl text-gray-900 text-center'>{ `What's stopping you from joining us. Come on have fun` }</DialogDescription>
        <Button onClick={() => mutate()}>Continue with Google</Button>
      </DialogContent>
    </Dialog>
  )
}
