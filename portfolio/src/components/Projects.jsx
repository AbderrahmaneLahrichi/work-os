import { useEffect, useRef } from 'react'
import { projects } from '../data/portfolioData'
import { observeElements } from '../utils/helpers'
import './Projects.css'

function Projects() {
  const cardsRef = useRef([])

  useEffect(() => {
    const cleanup = observeElements(cardsRef.current)
    return cleanup
  }, [])

  return (
    <section id="projects" className="section">
      <h2 className="section-title">Projects</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="project-card"
            ref={el => cardsRef.current[index] = el}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.technologies && (
              <div className="project-tech">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
            )}
            <div className="project-links">
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                View on GitHub &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Projects
