import { NavLinks } from './NavLinks'

export function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">Personal</div>
      <NavLinks />
    </nav>
  )
}
