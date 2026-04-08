import { useState } from 'react'
import { personalInfo } from '../data/portfolioData'
import ContactModal from './ContactModal'
import ResumeModal from './ResumeModal'
import './Hero.css'

function Hero() {
  const [showContact, setShowContact] = useState(false)
  const [showResume, setShowResume] = useState(false)

  return (
    <section id="home" className="hero">
      <div className="hero-split">
        <div className="hero-left">
          <div className="hero-photo-wrapper">
            <img src="/profile.jpg" alt="Abderrahmane Lahrichi" className="hero-photo" />
          </div>
        </div>
        <div className="hero-right">
          <h1>{personalInfo.name}</h1>
          <p className="hero-subtitle">Microsoft 365 Engineer &nbsp;·&nbsp; Endpoint Security &nbsp;·&nbsp; Security &amp; Compliance</p>
          <div className="hero-bio">
            <p>I started in IT at Bellevue College doing the basics: imaging machines, managing Active Directory, handling hardware and connectivity issues for students and staff across campus. Five years of that work gave me the kind of systems depth that most security engineers skip past.</p>
            <p>At Microsoft I moved into endpoint security, became the team's SME for Defender for Endpoint, handled Tier 2/3 escalations, wrote the playbooks, and mentored over a dozen engineers. When the Security and Compliance practice launched, I was one of three people who built it from nothing. Most of my time at Microsoft was spent inside GCC and GCC High tenants: Entra ID, Conditional Access, Exchange Online, DLP, sensitivity labels, Purview, Intune, KQL threat hunting.</p>
            <p>Currently focused on the cloud security and administration side. Certified in Azure Fundamentals, pursuing Security+ and MS-102.</p>
          </div>
          <div className="cta-buttons">
            <button className="btn" onClick={() => setShowContact(true)}>
              Get In Touch
            </button>
            <button className="btn" onClick={() => setShowResume(true)}>
              Resume
            </button>
          </div>
        </div>
      </div>
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      {showResume && <ResumeModal onClose={() => setShowResume(false)} />}
    </section>
  )
}

export default Hero
