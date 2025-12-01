import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Plus, Link2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function TikTokAccountsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: accounts } = await supabase
    .from('tiktok_accounts')
    .select('*')
    .eq('user_id', user?.id)
    .order('connected_at', { ascending: false })

  return (
    <div className="min-h-[calc(100vh-7.5rem)] p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="p-2 -ml-2 hover:bg-accent rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">TikTok Accounts</h1>
              <p className="text-sm text-muted-foreground">
                Manage connected accounts
              </p>
            </div>
          </div>
          <Button size="sm" disabled>
            <Plus className="h-4 w-4 mr-1" />
            Connect
          </Button>
        </div>

        {/* Coming soon notice */}
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-4">
            <p className="text-sm text-primary">
              TikTok account connection coming soon! You&apos;ll be able to automatically post generated videos.
            </p>
          </CardContent>
        </Card>

        {/* Accounts list */}
        {accounts && accounts.length > 0 ? (
          <div className="space-y-3">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Link2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">@{account.tiktok_username}</p>
                        <p className="text-xs text-muted-foreground">
                          Connected {new Date(account.connected_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Link2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No accounts connected</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your TikTok accounts to automatically post videos.
              </p>
              <Button disabled>
                <Plus className="h-4 w-4 mr-2" />
                Connect TikTok Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
