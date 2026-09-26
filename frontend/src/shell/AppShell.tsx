import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

export function AppShell() {
  return (
    <div className="shell">
      <Sidebar />
      <MobileNav />
      <main className="shell-main">
        <div className="app">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
