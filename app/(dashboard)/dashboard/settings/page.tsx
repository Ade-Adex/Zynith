'use client'

import { Stack, TextInput, Paper, Button, Divider } from '@mantine/core'
import { MOCK_USER } from '@/app/data/mockUser'

export default function SettingsPage() {
  return (
    <div className="py-8 max-w-2xl">
      <header className="mb-10">
        <h1 className="text-xl md:text-3xl font-bold uppercase tracking-tighter">
          Settings<span className="text-blue-600">.</span>
        </h1>
      </header>

      <Paper
        p="32px"
        radius="32px"
        withBorder
        className="border-slate-100 bg-white"
      >
        <Stack gap="xl">
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="First Name"
              defaultValue={MOCK_USER.firstName}
              classNames={{
                label: 'font-bold uppercase text-[14px]! tracking-widest mb-2',
              }}
            />
            <TextInput
              label="Last Name"
              defaultValue={MOCK_USER.lastName}
              classNames={{
                label: 'font-bold uppercase text-[10px] tracking-widest mb-2',
              }}
            />
          </div>
          <TextInput
            label="Email Address"
            defaultValue={MOCK_USER.email}
            classNames={{
              label: 'font-bold uppercase text-[10px] tracking-widest mb-2',
            }}
          />

          <Divider my="sm" className="opacity-50" />

          <Button
            color="blue"
            radius="xl"
            className="font-jakarta uppercase tracking-widest text-[11px] h-12"
          >
            Save Changes
          </Button>
        </Stack>
      </Paper>
    </div>
  )
}