import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Learning from './components/Learning'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackgroundAnimation from './components/BackgroundAnimation'
import NetworkNodes from './components/NetworkNodes'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'experience', 'projects', 'skills', 'learning', 'contact']
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
      <Projects />
      <Skills />
      <Learning />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
