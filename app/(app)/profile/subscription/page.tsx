'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { SUBSCRIPTION_PLANS, type UserTier } from '@/types'
import { cn } from '@/lib/utils'

export default function SubscriptionPage() {
  const [currentTier, setCurrentTier] = useState<UserTier>('free')
  const [isLoading, setIsLoading] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: user } = await supabase
          .from('users')
          .select('tier')
          .eq('id', authUser.id)
          .single()
        if (user) {
          setCurrentTier(user.tier as UserTier)
        }
      }
    }
    fetchUser()
  }, [])

  const handleSubscribe = async (tier: UserTier) => {
    if (tier === 'free' || tier === currentTier) return

    setIsLoading(tier)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })

      const { url, error } = await response.json()

      if (error) {
        console.error(error)
        return
      }

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleManageBilling = async () => {
    setIsLoading('manage')

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const { url, error } = await response.json()

      if (error) {
        console.error(error)
        return
      }

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
    } finally {
      setIsLoading(null)
    }
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
            <h1 className="text-xl font-bold">Subscription</h1>
            <p className="text-sm text-muted-foreground">
              Manage your plan
            </p>
          </div>
        </div>

        {/* Current plan */}
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <span className="font-medium">Current Plan</span>
              </div>
              <span className="text-lg font-bold text-primary">
                {SUBSCRIPTION_PLANS[currentTier].name}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="space-y-3">
          {(Object.entries(SUBSCRIPTION_PLANS) as [UserTier, typeof SUBSCRIPTION_PLANS.free][]).map(
            ([tier, plan]) => (
              <Card
                key={tier}
                className={cn(
                  'transition-colors',
                  tier === currentTier && 'border-primary'
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="text-right">
                      <span className="text-2xl font-bold">${plan.price}</span>
                      {plan.price > 0 && (
                        <span className="text-sm text-muted-foreground">/mo</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {tier === currentTier ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current plan
                    </Button>
                  ) : tier === 'free' ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleManageBilling}
                      isLoading={isLoading === 'manage'}
                    >
                      Manage billing
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe(tier)}
                      isLoading={isLoading === tier}
                    >
                      {currentTier === 'free' ? 'Subscribe' : 'Change plan'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          )}
        </div>

        {/* Manage billing */}
        {currentTier !== 'free' && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleManageBilling}
            isLoading={isLoading === 'manage'}
          >
            Manage billing
          </Button>
        )}
      </div>
    </div>
  )
}
