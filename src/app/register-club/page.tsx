/* eslint-disable @next/next/no-img-element */
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineCamera } from 'react-icons/ai';
import { z } from 'zod';
import Btn from '~/components/Button';
import Input from '~/components/Input';
import Textarea from '~/components/Textarea';
import { api } from '~/trpc/react';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  logo: z.custom<File>(),
})

type FormType = z.infer<typeof schema>;

const Step1 = () => {
  const [logoUrl, setLogoUrl] = useState('')
  const mutation = api.club.register.useMutation({
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
    await mutation.mutateAsync({name, description, image: newName})
  };

  return (
    <div className="h-full flex-col min-h-screen flex items-center justify-center gap-2">
      <div className="flex flex-col max-w-3xl bg-white pt-5 items-center w-full mx-auto overflow-hidden">
        <form
          className="h-full min-h-full self-stretch z-50 gap-6 mx-3 sm:mx-6 my-6 flex items-center justify-center flex-1 flex-col sm:flex-row px-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="logo"
            control={control}
            rules={{ required: !logoUrl && 'Logo is Required.' }}
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
                  className={`rounded-full my-2 h-40 w-40 top-0 border-gray-300 border ${
                    fieldState.error
                      ? 'outline outline-1 outline-offset-1 outline-red-400'
                      : ''
                  }`}
                  onClick={() => logoInput.current?.click()}
                >
                  {logoUrl ? (
                    <div className="h-full w-full rounded-full overflow-hidden">
                      <img
                        src={logoUrl}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="rounded-full h-full w-full bg-[#EEEEEE] flex justify-center items-center cursor-pointer text-gray-700">
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
              label="Club name"
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
              <Btn label="continue" isLoading={isSubmitting} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step1;
