import { useState } from 'react'
import { NavLinks } from './NavLinks'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mobile-nav">
      <div className="mobile-nav-bar">
        <span className="sidebar-brand">Personal</span>
        <button
          type="button"
          className="mobile-nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav-drawer"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close menu' : 'Menu'}
        </button>
      </div>

      {open && (
        <div id="mobile-nav-drawer" className="mobile-nav-drawer">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
