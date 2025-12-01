'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: user } = await supabase
          .from('users')
          .select('name')
          .eq('id', authUser.id)
          .single()
        if (user?.name) {
          setName(user.name)
        }
      }
    }
    fetchUser()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    setIsSaved(false)

    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (authUser) {
        await supabase
          .from('users')
          .update({ name })
          .eq('id', authUser.id)

        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-[calc(100vh-7.5rem)] p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/profile" className="p-2 -ml-2 hover:bg-accent rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your preferences
            </p>
          </div>
        </div>

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
            <Button
              onClick={handleSave}
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isSaved ? 'Saved!' : 'Save Changes'}
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
                <p className="text-xs text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isDark ? 'bg-primary' : 'bg-muted'
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
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-base text-destructive">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
