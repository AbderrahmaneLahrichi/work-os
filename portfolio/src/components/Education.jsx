import { useEffect, useRef } from 'react'
import { education } from '../data/portfolioData'
import { observeElements } from '../utils/helpers'
import './Education.css'

function Education() {
  const cardsRef = useRef([])

  useEffect(() => {
    const cleanup = observeElements(cardsRef.current)
    return cleanup
  }, [])

  return (
    <section id="education" className="section">
      <h2 className="section-title">Education</h2>
      <div className="education-grid">
        {education.map((item, index) => (
          <div
            key={item.id}
            className="education-card"
            ref={el => cardsRef.current[index] = el}
          >
            <div className="education-card-left" />
            <div className="education-card-body">
              <div className="education-header">
                <div>
                  <h3 className="education-school">{item.school}</h3>
                  <p className="education-degree">{item.degree} &mdash; {item.field}</p>
                </div>
                <span className="education-date">{item.graduated}</span>
              </div>
              <p className="education-location">{item.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Education
