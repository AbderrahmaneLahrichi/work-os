import { personalInfo } from '../data/portfolioData'
import './Contact.css'

function Contact() {
  const emailUrl = `mailto:${personalInfo.email}`

  return (
    <section id="contact" className="section">
      <h2 className="section-title">Get In Touch</h2>
      <div className="contact-info">
        <div className="contact-item">
          <i>📧</i>
          <a href={emailUrl}>
            {personalInfo.email}
          </a>
        </div>
        <div className="contact-item">
          <i>💼</i>
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
        <div className="contact-item">
          <i>💻</i>
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact
