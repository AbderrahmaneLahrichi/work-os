import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import Experience from '../components/Experience'
import Education from '../components/Education'
import Projects from '../components/Projects'
import Learning from '../components/Learning'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import BackgroundAnimation from '../components/BackgroundAnimation'
import NetworkNodes from '../components/NetworkNodes'

function Home() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'experience', 'education', 'projects', 'learning', 'about', 'contact']
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app">
      <BackgroundAnimation />
      <NetworkNodes />
      <Navigation activeSection={activeSection} />
      <Hero />
      <Experience />
      <Education />
      <Projects />
      <Learning />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}

export default Home
