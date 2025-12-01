import Link from 'next/link'
import { Zap, Play, Sparkles, BarChart3, Clock, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SUBSCRIPTION_PLANS } from '@/types'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Zap className="h-6 w-6" />
            AdForge
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Sign in
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered TikTok UGC
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Create Viral TikTok Videos in{' '}
            <span className="text-primary">Seconds</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Generate authentic UGC videos for any product. Perfect for creators, brands, and agencies who want to scale their TikTok presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Creating Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Play className="h-4 w-4 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to dominate TikTok
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI Video Generation</h3>
              <p className="text-sm text-muted-foreground">
                Describe your product and let AI create engaging UGC-style videos automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Track views, likes, shares, and engagement across all your generated content.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Save Hours Daily</h3>
              <p className="text-sm text-muted-foreground">
                Generate weeks of content in minutes. Focus on strategy while AI handles creation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Start free, upgrade when you need more
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(SUBSCRIPTION_PLANS).map(([tier, plan]) => (
              <div
                key={tier}
                className={`rounded-xl border p-6 ${
                  tier === 'pro' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                {tier === 'pro' && (
                  <div className="text-xs font-medium text-primary mb-2">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button
                    className="w-full"
                    variant={tier === 'pro' ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to create viral content?
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Join thousands of creators and brands using AdForge to scale their TikTok presence.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Start Creating Free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-bold text-primary">
              <Zap className="h-5 w-5" />
              AdForge
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8">
            &copy; {new Date().getFullYear()} AdForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
