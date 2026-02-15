import { smoothScroll } from '../utils/helpers'
import './Navigation.css'

function Navigation({ activeSection }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'learning', label: 'Learning' }
  ]

  return (
    <nav className="navigation">
      <ul>
        {navItems.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={activeSection === item.id ? 'active' : ''}
              onClick={(e) => smoothScroll(e, item.id)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
