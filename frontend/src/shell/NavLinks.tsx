import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'

type NavLinksProps = {
  onNavigate?: () => void
}

export function NavLinks({ onNavigate }: NavLinksProps) {
  return (
    <ul className="nav-links">
      {NAV_ITEMS.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
