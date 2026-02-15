import { useEffect, useRef } from 'react'
import { skillCategories } from '../data/portfolioData'
import { observeElements } from '../utils/helpers'
import './Skills.css'

function Skills() {
  const cardsRef = useRef([])

  useEffect(() => {
    const cleanup = observeElements(cardsRef.current)
    return cleanup
  }, [])

  return (
    <section id="skills" className="section">
      <h2 className="section-title">Technical Skills</h2>
      <div className="skills-grid">
        {skillCategories.map((category, index) => (
          <div
            key={category.id}
            className="skill-category"
            ref={el => cardsRef.current[index] = el}
          >
            <h3>{category.name}</h3>
            <div className="skill-tags">
              {category.skills.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
