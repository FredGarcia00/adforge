import { Sidebar } from '@/components/layout/sidebar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Sidebar />
      <main className="ml-[250px] min-h-screen">
        {children}
      </main>
    </div>
  )
}
