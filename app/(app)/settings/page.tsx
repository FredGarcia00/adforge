'use client'

import { useState } from 'react'
import { User, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  const [name, setName] = useState('Demo User')
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
        <p className="text-sm text-zinc-500">
          Manage your account preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <Button className="bg-[#FE2C55] hover:bg-[#FE2C55]/90">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-zinc-500">
                  Toggle between light and dark theme
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isDark ? 'bg-[#FE2C55]' : 'bg-zinc-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    isDark ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-red-500/50">
          <CardHeader>
            <CardTitle className="text-base text-red-500">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500 mb-4">
              Once you delete your account, there is no going back.
            </p>
            <Button variant="destructive">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
