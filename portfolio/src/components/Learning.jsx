import { useEffect, useRef } from 'react'
import { learningItems } from '../data/portfolioData'
import { observeElements } from '../utils/helpers'
import './Learning.css'

function Learning() {
  const cardsRef = useRef([])

  useEffect(() => {
    const cleanup = observeElements(cardsRef.current)
    return cleanup
  }, [])

  const microsoftItems = learningItems.filter(i => i.group === 'microsoft')
  const comptiaItems = learningItems.filter(i => i.group === 'comptia')
  const allGroups = [microsoftItems, comptiaItems]
  let cardIndex = 0

  const renderCard = (item) => {
    const index = cardIndex++
    return (
      <div
        key={item.id}
        className={`learning-card${item.status === 'completed' ? ' completed' : ''}`}
        ref={el => cardsRef.current[index] = el}
      >
        <div className="learning-header">
          <h3>{item.title}</h3>
          <span className={`status-badge ${item.status}`}>
            {item.status === 'completed' ? 'Completed' : 'In Progress'}
          </span>
        </div>
        {item.badgeUrl && (
          <div className="cert-badge-wrapper">
            <img src={item.badgeUrl} alt={`${item.title} badge`} className="cert-badge" />
          </div>
        )}
        <p>{item.description}</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${item.progress}%` }}
          >
            <span className="progress-text">{item.progress}%</span>
          </div>
        </div>
        {item.completedDate && (
          <div className="completed-date">Passed: {item.completedDate}</div>
        )}
      </div>
    )
  }

  return (
    <section id="learning" className="section">
      <h2 className="section-title">Certifications</h2>
      <div className="learning-groups">
        <div className="learning-grid learning-grid-microsoft">
          {microsoftItems.map(renderCard)}
        </div>
        <div className="learning-grid learning-grid-comptia">
          {comptiaItems.map(renderCard)}
        </div>
      </div>
    </section>
  )
}

export default Learning
