import { useEffect, useRef } from 'react'
import { observeElements } from '../utils/helpers'
import './About.css'

function About() {
  const ref = useRef([])

  useEffect(() => {
    const cleanup = observeElements(ref.current)
    return cleanup
  }, [])

  return (
    <section id="about" className="section">
      <h2 className="section-title">About Me</h2>
      <div className="about-content" ref={el => ref.current[0] = el}>
        <p>When I'm not working, I'm usually trying to stay active. I grew up playing soccer and football, and that love for competition never really went away. These days it's expanded to pickleball and volleyball too. If there's a game happening, I'm probably in. On the weekends, I like to get outside whenever I can. Some of my favorite memories are from hiking trips with friends, fishing early in the morning before anyone else is up, or camping somewhere with no cell service and just disconnecting for a while.</p>
      </div>
    </section>
  )
}

export default About
