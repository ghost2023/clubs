'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { AiOutlineCamera } from 'react-icons/ai'
import { FaHeart } from 'react-icons/fa'
import { z } from 'zod'
import Btn from '~/components/Button'
import Input from '~/components/Input'
import Textarea from '~/components/Textarea'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { api } from '~/trpc/react'

export const Topbar = ({club} : {club: {name: string, id: number}}) => {
  const [page, setPage] = useState<number>(0)
  return (
      <header className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <div className="text-2xl font-bold">{club?.name}</div>
        <div className="flex items-center gap-2">
          <Dialog> 
          <DialogTrigger>
<Button variant="outline">Post</Button>
          </DialogTrigger>
          <DialogContent>
            {[<SelectorPage setPage={setPage}/>, <PostPage/>, <FundPage/>, <EventPage/>][page]}
          </DialogContent>
          </Dialog>
        </div>
      </header>
  )
}

const SelectorPage = ({setPage}: {setPage: (n: number) => void}) => {

  return <>
          <DialogTitle>What do you want to post?</DialogTitle>
  <div className="flex gap-3 justify-evenly">
    <Button variant={'outline'} className='flex-col h-full flex-1' onClick={() => setPage(1)}>
      <FaHeart size={36} className='text-primary'/> 
      <p className='text-lg'>Post</p>
    </Button>
    <Button variant={'outline'} className='flex-col h-full flex-1' onClick={() => setPage(2)}>
      <FaHeart size={36} className='text-primary'/> 
      <p className='text-lg'>Fund Raising</p>
    </Button>
    <Button variant={'outline'} className='flex-col h-full flex-1' onClick={() => setPage(3)}>
      <FaHeart size={36} className='text-primary'/> 
      <p className='text-lg'>Event</p>
    </Button>           
  </div></>
}

const EventPage = ( ) => {
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    location: z.string(),
    logo: z.custom<File>(),
  })

  type FormType = z.infer<typeof schema>;

  const mutation = api.club.createEvent.useMutation({
    onSuccess: () => {
      window.location.href = '/dashboard'
    }
  })
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(schema)
  });

  const [logoUrl, setLogoUrl] = useState('')
  const logoInput = useRef<HTMLInputElement>(null);

  const uploadLogo = async (file: File) => {
    let formData = new FormData();
    formData.set('file', file);
    formData.set('name', file.name);

    const res = await fetch(`/api/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data
  };

  const onSubmit: SubmitHandler<FormType> = async ({
    name,
    description,
    logo,
    location
  }) => {
    const {newName} = await uploadLogo(logo)
    await mutation.mutateAsync({title:name, description,image: newName, start_at: new Date(), end_at: new Date(), location })
  };

  return (
    <>
      <DialogTitle>Fill in form to create Post raising</DialogTitle>
      <form
        className="self-stretch z-50 gap-6 flex flex-col items-center justify-center flex-1 sm:flex-row px-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="logo"
          control={control}
          rules={{ required: 'Image is Required.' }}
          render={({ field, fieldState }) => (
            <div className="sm:self-start">
              <input
                type="file"
                name=""
                id=""
                onChange={e => {
                  const files = e.target.files;
                  if (files && files.length) {
                    field.onChange(files[0]);
                    setLogoUrl(URL.createObjectURL(files[0]!));
                  }
                }}
                accept="image/*"
                className="hidden"
                ref={logoInput}
              />
              <div
                className={`rounded-xl my-2 h-48 w-48 top-0 border-gray-300 border ${
fieldState.error
? 'outline outline-1 outline-offset-1 outline-red-400'
: ''
}`}
                onClick={() => logoInput.current?.click()}
              >
                {logoUrl ? (
                  <div className="h-full w-full rounded-xl overflow-hidden">
                    <img
                      src={logoUrl}
                      className="h-full w-full object-cover"
                      alt=""
                    />
                  </div>
                ) : (
                    <div className="rounded-xl h-full w-full bg-[#EEEEEE] flex justify-center items-center cursor-pointer text-gray-700">
                      <AiOutlineCamera size={44} />
                    </div>
                  )}
              </div>

              {fieldState.error ? (
                <p className="text-xs text-center text-red-500 mt-1">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />
        <div className="max-w-sm w-full">
          <Input
            id="name"
            type="text"
            label="Title"
            {...register('name', { required: 'Name is required.' })}
            error={errors.name?.message}
          />

          <Input
            id="name"
            type="text"
            label="Location"
            {...register('location', { required: 'Name is required.' })}
            error={errors.name?.message}
          />
          <Textarea
            {...register('description')}
            rows={3}
            id="description"
            label="Description"
            containerClassName="mb-4 mt-4"
          />

          <div className="flex items-center justify-end">
            <Btn label="Post" isLoading={isSubmitting} />
          </div>
        </div>
      </form></>
  );
}

const PostPage = () => {
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Caption is required'),
  logo: z.custom<File>(),
})

type FormType = z.infer<typeof schema>;

  const mutation = api.club.createPost.useMutation({
    onSuccess: () => {
      window.location.href = '/dashboard'
    }
  })
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(schema)
  });

  const [logoUrl, setLogoUrl] = useState('')
  const logoInput = useRef<HTMLInputElement>(null);

  const uploadLogo = async (file: File) => {
    let formData = new FormData();
    formData.set('file', file);
    formData.set('name', file.name);

    const res = await fetch(`/api/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data
  };

  const onSubmit: SubmitHandler<FormType> = async ({
    name,
    description,
    logo,
  }) => {
    const {newName} = await uploadLogo(logo)
    await mutation.mutateAsync({title:name, description,image: newName})
  };

  return (
    <>
    <DialogTitle>Fill in form to create Post raising</DialogTitle>
    <form
      className="self-stretch z-50 gap-6 flex flex-col items-center justify-center flex-1 sm:flex-row px-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="logo"
        control={control}
        rules={{ required: 'Image is Required.' }}
        render={({ field, fieldState }) => (
          <div className="sm:self-start">
            <input
              type="file"
              name=""
              id=""
              onChange={e => {
                const files = e.target.files;
                if (files && files.length) {
                  field.onChange(files[0]);
                  setLogoUrl(URL.createObjectURL(files[0]!));
                }
              }}
              accept="image/*"
              className="hidden"
              ref={logoInput}
            />
            <div
              className={`rounded-xl my-2 h-48 w-48 top-0 border-gray-300 border ${
fieldState.error
? 'outline outline-1 outline-offset-1 outline-red-400'
: ''
}`}
              onClick={() => logoInput.current?.click()}
            >
              {logoUrl ? (
                <div className="h-full w-full rounded-xl overflow-hidden">
                  <img
                    src={logoUrl}
                    className="h-full w-full object-cover"
                    alt=""
                  />
                </div>
              ) : (
                  <div className="rounded-xl h-full w-full bg-[#EEEEEE] flex justify-center items-center cursor-pointer text-gray-700">
                    <AiOutlineCamera size={44} />
                  </div>
                )}
            </div>

            {fieldState.error ? (
              <p className="text-xs text-center text-red-500 mt-1">
                {fieldState.error.message}
              </p>
            ) : null}
          </div>
        )}
      />
      <div className="max-w-sm w-full">
        <Input
          id="name"
          type="text"
          label="Title"
          {...register('name', { required: 'Name is required.' })}
          error={errors.name?.message}
        />

        <Textarea
          {...register('description')}
          rows={3}
          id="description"
          label="Description"
          containerClassName="mb-4 mt-4"
        />

        <div className="flex items-center justify-end">
          <Btn label="Post" isLoading={isSubmitting} />
        </div>
      </div>
    </form></>
  );
}

const FundPage = () => {
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  logo: z.custom<File>(),
  goal: z.coerce.number(),
})

type FormType = z.infer<typeof schema>;

  const mutation = api.club.createFund.useMutation({
    onSuccess: () => {
      window.location.href = '/dashboard'
    }
  })
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(schema)
  });

  const [logoUrl, setLogoUrl] = useState('')
  const logoInput = useRef<HTMLInputElement>(null);

  const uploadLogo = async (file: File) => {
    let formData = new FormData();
    formData.set('file', file);
    formData.set('name', file.name);

    const res = await fetch(`/api/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data
  };

  const onSubmit: SubmitHandler<FormType> = async ({
    name,
    description,
    logo,
    goal
  }) => {
    const {newName} = await uploadLogo(logo)
    await mutation.mutateAsync({title:name, description,goal ,image: newName})
  };

  return (
    <>
    <DialogTitle>Fill in form to create fund raising</DialogTitle>
    <form
      className="self-stretch z-50 gap-6 flex flex-col items-center justify-center flex-1 sm:flex-row px-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="logo"
        control={control}
        rules={{ required: 'Image is Required.' }}
        render={({ field, fieldState }) => (
          <div className="sm:self-start">
            <input
              type="file"
              name=""
              id=""
              onChange={e => {
                const files = e.target.files;
                if (files && files.length) {
                  field.onChange(files[0]);
                  setLogoUrl(URL.createObjectURL(files[0]!));
                }
              }}
              accept="image/*"
              className="hidden"
              ref={logoInput}
            />
            <div
              className={`rounded-xl my-2 h-48 w-48 top-0 border-gray-300 border ${
fieldState.error
? 'outline outline-1 outline-offset-1 outline-red-400'
: ''
}`}
              onClick={() => logoInput.current?.click()}
            >
              {logoUrl ? (
                <div className="h-full w-full rounded-xl overflow-hidden">
                  <img
                    src={logoUrl}
                    className="h-full w-full object-cover"
                    alt=""
                  />
                </div>
              ) : (
                  <div className="rounded-xl h-full w-full bg-[#EEEEEE] flex justify-center items-center cursor-pointer text-gray-700">
                    <AiOutlineCamera size={44} />
                  </div>
                )}
            </div>

            {fieldState.error ? (
              <p className="text-xs text-center text-red-500 mt-1">
                {fieldState.error.message}
              </p>
            ) : null}
          </div>
        )}
      />
      <div className="max-w-sm w-full">
        <Input
          id="name"
          type="text"
          label="Title"
          {...register('name', { required: 'Name is required.' })}
          error={errors.name?.message}
        />

        <Input
          id="name"
          type="number"
          label="Goal"
          {...register('goal', { required: 'Goal is required.' })}
          error={errors.goal?.message}
        />

        <Textarea
          {...register('description')}
          rows={3}
          id="description"
          label="Description"
          containerClassName="mb-4 mt-4"
        />

        <div className="flex items-center justify-end">
          <Btn label="Post" isLoading={isSubmitting} />
        </div>
      </div>
    </form></>
  );
}
