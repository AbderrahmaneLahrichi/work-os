import { Link } from 'react-router-dom'
import { smoothScroll } from '../utils/helpers'
import './Navigation.css'

function Navigation({ activeSection }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'learning', label: 'Learning' },
    { id: 'about', label: 'About' }
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
        <li>
          <Link to="/docs" className="nav-docs-link">
            Documentation
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
