'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Stack,
  TextInput,
  Paper,
  Button,
  Divider,
  Avatar,
  Group,
  Text,
} from '@mantine/core'
import { useSnackbar } from 'notistack'
import { Camera, Loader2 } from 'lucide-react'

import { useAuthStore, UserData } from '@/app/store/authStore'
import { updateProfileSettingsAction } from '@/app/services/dashboardActions'

export default function SettingsPage() {
  const { user, login, hasHydrated } = useAuthStore()
  const { enqueueSnackbar } = useSnackbar()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [saving, setSaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const componentsLoadedRef = useRef(false)

  // Safely populate local form input fields exactly once when local storage hydration completes
  useEffect(() => {
    if (hasHydrated && user && !componentsLoadedRef.current) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setAvatar(user.avatar || '')
      componentsLoadedRef.current = true
    }
  }, [hasHydrated, user])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      enqueueSnackbar('The selected image must be less than 2MB.', {
        variant: 'error',
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

 const handleSaveProfile = async () => {
   if (!user?._id) return

   try {
     setSaving(true)

     if (!firstName.trim() || !lastName.trim()) {
       enqueueSnackbar('Identity structural fields cannot be empty.', {
         variant: 'error',
       })
       return
     }

     // Execute the server database mutation action
     const result = await updateProfileSettingsAction({
       userId: user._id,
       firstName: firstName,
       lastName: lastName,
       avatar: avatar,
     })

     if (result.success && result.data) {
       const structuredUserUpdate: UserData = {
         ...result.data,
         createdAt: new Date(result.data.createdAt),
         updatedAt: new Date(result.data.updatedAt),
       }

       login(structuredUserUpdate)

       // Dynamic success message returned directly from your server action
       enqueueSnackbar(
         result.message || 'Profile configuration updated successfully.',
         {
           variant: 'success',
         },
       )
     } else {
       // Dynamic error message returned directly from your server action
       enqueueSnackbar(result.error || 'Failed to update credentials.', {
         variant: 'error',
       })
     }
   } catch (error) {
     console.error(error)
     enqueueSnackbar('An unexpected application runtime failure occurred.', {
       variant: 'error',
     })
   } finally {
     setSaving(false)
   }
 }

  if (!hasHydrated) {
    return (
      <div className="py-8 max-w-2xl flex items-center gap-2 text-foreground bg-background">
        <Loader2 className="animate-spin text-blue-600" size={16} />
        <Text
          size="xs"
          fw={700}
          className="uppercase tracking-widest text-slate-400"
        >
          Synchronizing Workspace Storage...
        </Text>
      </div>
    )
  }

  return (
    <div className='flex justify-center'>

    <div className="py-8 max-w-2xl w-full">
      <header className="mb-5">
        <h1 className="text-xl md:text-3xl font-bold uppercase tracking-tighter">
          Settings<span className="text-blue-600">.</span>
        </h1>
      </header>

      <Paper
        p="32px"
        radius="32px"
        withBorder
        className="border-slate-100 bg-white dark:bg-slate-950 dark:border-slate-800"
      >
        <Stack gap="xl">
          {/* USER IMAGE MATRIX PICKER FRAME */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar
                size={80}
                radius="xl"
                src={avatar || undefined}
                className="shadow-md border-2 border-blue-500 transition-opacity group-hover:opacity-80"
              >
                {firstName.slice(0, 1) || 'U'}
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} className="text-white" />
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <Text
                fw={700}
                size="xs"
                className="uppercase tracking-widest text-slate-500"
              >
                Profile Picture
              </Text>
              <Text
                size="xs"
                className="text-slate-400 max-w-xs leading-normal"
              >
                Click to change and upload your photo.
              </Text>
              <Button
                size="xs"
                variant="light"
                color="blue"
                radius="md"
                onClick={() => fileInputRef.current?.click()}
                leftSection={<Camera size={12} />}
                className="font-bold uppercase tracking-wider text-[10px] mt-1"
              >
                Choose Photo
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* NAME WORKSPACE FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={saving}
              radius="md"
              classNames={{
                input:
                  'bg-background! dark:bg-slate-900! font-bold text-slate-800 dark:text-slate-200 h-11',
                label:
                  'font-bold uppercase text-[10px] tracking-widest mb-2 text-slate-400',
              }}
            />
            <TextInput
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={saving}
              radius="md"
              classNames={{
                input:
                  'bg-background! dark:bg-slate-900! font-bold text-slate-800 dark:text-slate-200 h-11',
                label:
                  'font-bold uppercase text-[10px] tracking-widest mb-2 text-slate-400',
              }}
            />
          </div>

          {/* IMMUTABLE CORE IDENTITY FIELD */}
          <TextInput
            label="Email Address"
            value={user?.email || ''}
            readOnly
            disabled
            radius="md"
            variant="filled"
            classNames={{
              input:
                'bg-slate-50/50! dark:bg-slate-900/40! opacity-60 font-semibold text-slate-400 h-11 border-slate-200 dark:border-slate-800',
              label:
                'font-bold uppercase text-[10px] tracking-widest mb-2 text-slate-400',
            }}
          />

          <Divider my="sm" className="opacity-50 dark:border-slate-800" />

          {/* SUBMIT BUTTON */}
          <Button
            color="blue"
            radius="xl"
            disabled={saving}
            onClick={handleSaveProfile}
            className="font-jakarta uppercase tracking-widest text-[11px] h-12 transition-all shadow-xs"
          >
            {saving ? (
              <Group gap={8} justify="center">
                <Loader2 className="animate-spin" size={14} />
                <span>Saving Credentials...</span>
              </Group>
            ) : (
              'Save Changes'
            )}
          </Button>
        </Stack>
      </Paper>
    </div>
    </div>
  )
}
