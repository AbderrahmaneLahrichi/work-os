import { useEffect } from 'react'
import './ExperienceModal.css'

function ExperienceModal({ experience, onClose }) {
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
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>&times;</button>

        <div className="modal-header">
          <div className="modal-header-left">
            <h2 className="modal-title">{experience.title}</h2>
            <div className="modal-company">{experience.company}</div>
          </div>
          <div className="modal-header-right">
            <div className="modal-location">{experience.location}</div>
            <div className="modal-period">{experience.period}</div>
          </div>
        </div>

        <p className="modal-summary">{experience.summary}</p>

        <div className="modal-section">
          <h3>Responsibilities</h3>
          <ul>
            {experience.responsibilities.map((resp, i) => (
              <li key={i}>{resp}</li>
            ))}
          </ul>
        </div>

        {experience.technicalSkills && experience.technicalSkills.length > 0 && (
          <div className="modal-section">
            <h3>Technical Skills</h3>
            <div className="modal-tags">
              {experience.technicalSkills.map((skill, i) => (
                <span key={i} className="modal-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {experience.softSkills && experience.softSkills.length > 0 && (
          <div className="modal-section">
            <h3>Soft Skills</h3>
            <div className="modal-tags">
              {experience.softSkills.map((skill, i) => (
                <span key={i} className="modal-tag tag-soft">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {experience.frameworks && experience.frameworks.length > 0 && (
          <div className="modal-section">
            <h3>Frameworks</h3>
            <div className="modal-tags">
              {experience.frameworks.map((fw, i) => (
                <span
                  key={i}
                  className={`modal-tag ${fw.role === 'primary' ? 'tag-primary' : 'tag-familiar'}`}
                >
                  {fw.name}
                </span>
              ))}
            </div>
            {experience.frameworkNote && (
              <p className="framework-note">{experience.frameworkNote}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExperienceModal
