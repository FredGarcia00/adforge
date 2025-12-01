// import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
// import { redirect } from 'next/navigation'
import {
  User,
  CreditCard,
  Link2,
  Settings,
  LogOut,
  ChevronRight,
  Crown,
  Video
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SUBSCRIPTION_PLANS } from '@/types'

export default async function ProfilePage() {
  // Disabled for UI preview - uncomment when Supabase is configured
  // const supabase = await createClient()
  // const { data: { user: authUser } } = await supabase.auth.getUser()
  // if (!authUser) {
  //   redirect('/login')
  // }
  // const { data: user } = await supabase
  //   .from('users')
  //   .select('*')
  //   .eq('id', authUser.id)
  //   .single()

  // Mock data for UI preview
  const user: { name: string; avatar_url: string | null; tier: 'free' | 'pro' | 'agency'; videos_this_month: number } = {
    name: 'Demo User',
    avatar_url: null,
    tier: 'pro',
    videos_this_month: 12,
  }
  const authUser = { email: 'demo@adforge.ai' }
  const videoCount = 15
  const tiktokCount = 2

  const plan = SUBSCRIPTION_PLANS[user?.tier || 'free']
  const videosUsed = user?.videos_this_month || 0
  const videosLimit = plan.videosPerMonth === -1 ? 'Unlimited' : plan.videosPerMonth

  const menuItems = [
    {
      href: '/profile/subscription',
      icon: CreditCard,
      label: 'Subscription',
      description: `${plan.name} plan`,
    },
    {
      href: '/profile/tiktok',
      icon: Link2,
      label: 'TikTok Accounts',
      description: `${tiktokCount || 0} connected`,
    },
    {
      href: '/profile/settings',
      icon: Settings,
      label: 'Settings',
      description: 'Preferences & account',
    },
  ]

  return (
    <div className="min-h-[calc(100vh-7.5rem)] p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Profile header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  {user?.name || 'User'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {authUser.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Crown className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    {plan.name}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage stats */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Videos This Month</span>
              </div>
              <span className="text-sm">
                {videosUsed} / {videosLimit}
              </span>
            </div>
            {plan.videosPerMonth !== -1 && (
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${Math.min((videosUsed / plan.videosPerMonth) * 100, 100)}%`,
                  }}
                />
              </div>
            )}
            {user?.tier === 'free' && (
              <Link href="/profile/subscription">
                <Button size="sm" className="w-full mt-3">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade for more videos
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Menu items */}
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Sign out */}
        <form action="/auth/signout" method="POST">
          <Button
            type="submit"
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </form>
      </div>
    </div>
  )
}
