import { useState, useEffect, useRef } from 'react'
import { experiences } from '../data/portfolioData'
import { observeElements } from '../utils/helpers'
import ExperienceModal from './ExperienceModal'
import './Experience.css'

function Experience() {
  const [selectedExperience, setSelectedExperience] = useState(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const cleanup = observeElements(cardsRef.current)
    return cleanup
  }, [])

  return (
    <section id="experience" className="section">
      <h2 className="section-title">Professional Experience</h2>
      <div className="experience-grid">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="experience-card"
            ref={el => cardsRef.current[index] = el}
            onClick={() => setSelectedExperience(exp)}
          >
            <h3>{exp.title}</h3>
            <div className="company">{exp.company}</div>
            <div className="card-period">{exp.period}</div>
            <p className="summary">{exp.summary}</p>
            <span className="card-hint">Click for details</span>
          </div>
        ))}
      </div>
      {selectedExperience && (
        <ExperienceModal
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}
    </section>
  )
}

export default Experience
