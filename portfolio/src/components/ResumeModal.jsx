import { useEffect } from 'react'
import { personalInfo, experiences, education, skillCategories } from '../data/portfolioData'
import './ResumeModal.css'

function ResumeModal({ onClose }) {
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

  const coreSkills = skillCategories
    .filter(cat => ['Microsoft 365 & Cloud', 'Security Tools', 'Scripting & Automation'].includes(cat.name))
    .flatMap(cat => cat.skills)

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="resume-modal-container">
        <div className="resume-modal-actions">
          <a
            href="/Abderrahmane%20Lahrichi%20_%20Resume.pdf"
            download="Abderrahmane Lahrichi Resume.pdf"
            className="resume-download-btn"
          >
            Download Resume
          </a>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="resume-body">

          <header className="resume-header">
            <h1>{personalInfo.name}</h1>
            <div className="resume-contact">
              <span>{personalInfo.location}</span>
              <span>{personalInfo.email}</span>
              <span>{personalInfo.phone}</span>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </header>

          <section className="resume-section">
            <h2>Experience</h2>
            {experiences.map(exp => (
              <div key={exp.id} className="resume-exp-item">
                <div className="resume-exp-header">
                  <div>
                    <span className="resume-job-title">{exp.title}</span>
                    <span className="resume-company"> — {exp.company}</span>
                  </div>
                  <span className="resume-period">{exp.period}</span>
                </div>
                <ul className="resume-bullets">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="resume-section">
            <h2>Education</h2>
            {education.map(edu => (
              <div key={edu.id} className="resume-edu-item">
                <div className="resume-exp-header">
                  <div>
                    <span className="resume-job-title">{edu.degree}, {edu.field}</span>
                    <span className="resume-company"> — {edu.school}</span>
                  </div>
                  <span className="resume-period">{edu.graduated}</span>
                </div>
              </div>
            ))}
          </section>

          <section className="resume-section">
            <h2>Skills</h2>
            <div className="resume-skills">
              {coreSkills.map((skill, i) => (
                <span key={i} className="resume-skill-tag">{skill}</span>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default ResumeModal
