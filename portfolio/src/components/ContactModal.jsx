import { useEffect } from 'react'
import { personalInfo } from '../data/portfolioData'
import './ContactModal.css'

function ContactModal({ onClose }) {
  const emailUrl = `mailto:${personalInfo.email}`

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="contact-modal-overlay" onClick={handleOverlayClick}>
      <div className="contact-modal">
        <button className="contact-modal-close" onClick={onClose}>&times;</button>
        <h2>Get In Touch</h2>
        <p>Choose how you'd like to reach me</p>
        <div className="contact-options">
          <a href={emailUrl} className="contact-option">
            <span className="contact-icon">📧</span>
            <span className="contact-label">Email</span>
            <span className="contact-detail">{personalInfo.email}</span>
          </a>
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-option">
            <span className="contact-icon">💼</span>
            <span className="contact-label">LinkedIn</span>
            <span className="contact-detail">Connect with me</span>
          </a>
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="contact-option">
            <span className="contact-icon">💻</span>
            <span className="contact-label">GitHub</span>
            <span className="contact-detail">View my work</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ContactModal
