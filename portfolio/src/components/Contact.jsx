import { useState } from 'react'
import { personalInfo } from '../data/portfolioData'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section">
      <h2 className="section-title">Get In Touch</h2>

      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="What's on your mind?"
            />
          </div>

          {status === 'success' && (
            <p className="form-success">Message sent. I'll get back to you soon.</p>
          )}
          {status === 'error' && (
            <p className="form-error">Something went wrong. Try emailing directly.</p>
          )}

          <button
            type="submit"
            className="form-submit"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className="contact-links">
          <a href={`mailto:${personalInfo.email}`} className="contact-link-item">
            <span className="contact-link-icon">📧</span>
            <span>{personalInfo.email}</span>
          </a>
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link-item">
            <span className="contact-link-icon">💼</span>
            <span>LinkedIn</span>
          </a>
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="contact-link-item">
            <span className="contact-link-icon">💻</span>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact
