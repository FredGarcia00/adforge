'use client'

import { Check, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SUBSCRIPTION_PLANS, type UserTier } from '@/types'
import { cn } from '@/lib/utils'

export default function SubscriptionPage() {
  // Mock for preview - using explicit typing to allow conditional checks
  const currentTier = 'pro' as UserTier

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Subscription</h1>
        <p className="text-sm text-zinc-500">
          Manage your plan and billing
        </p>
      </div>

      {/* Current plan */}
      <Card className="mb-6 border-[#FE2C55]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-[#FE2C55]" />
              <span className="font-medium">Current Plan</span>
            </div>
            <span className="text-lg font-bold text-[#FE2C55]">
              {SUBSCRIPTION_PLANS[currentTier].name}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-4">
        {(Object.entries(SUBSCRIPTION_PLANS) as [UserTier, typeof SUBSCRIPTION_PLANS.free][]).map(
          ([tier, plan]) => (
            <Card
              key={tier}
              className={cn(
                'transition-colors',
                tier === currentTier && 'border-[#FE2C55]'
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="text-right">
                    <span className="text-2xl font-bold">${plan.price}</span>
                    {plan.price > 0 && (
                      <span className="text-sm text-zinc-500">/mo</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-[#FE2C55] shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {tier === currentTier ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button className="w-full bg-[#FE2C55] hover:bg-[#FE2C55]/90">
                    {currentTier === 'free' ? 'Subscribe' : 'Change plan'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  )
}
