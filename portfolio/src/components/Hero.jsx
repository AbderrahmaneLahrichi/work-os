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
            <p>At Microsoft I was one of three founding engineers on the Security and Compliance practice, built the playbooks, and became the SME for Defender for Office 365 and Purview. The year before that I worked endpoint security incident response: customers came in with active incidents and I investigated alongside them, pulling device logs from Event Viewer, collecting network traces, running KQL hunts in Advanced Hunting, and triaging suspicious files. The other side of that work was making sure MDE was deployed correctly and devices were reporting clean telemetry. Nearly all of it was inside GCC and GCC High tenants. That work was grounded in five years of IT administration at Bellevue College, where I managed endpoints, Active Directory, and device lifecycle across campus.</p>
            <p>Currently building Grali, an AI-powered tool that generates prescriptive, phase-based security implementation roadmaps from an organization's existing stack. Certified in Azure Fundamentals, pursuing SC-200 and Security+.</p>
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
